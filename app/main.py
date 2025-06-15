from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import logging
import os

from app.database import get_db, init_db, check_db_connection
from app.auth import get_current_active_user, authenticate_user, create_access_token, create_refresh_token
from app.models import User
from app.schemas import *
from app import crud
from config.credentials import app_config, validate_config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Validate configuration
try:
    validate_config()
except ValueError as e:
    logger.error(f"Configuration error: {e}")
    raise

# Create FastAPI app
app = FastAPI(
    title=app_config.app_name,
    version=app_config.version,
    description="A comprehensive personal finance tracking application",
    docs_url="/docs" if app_config.debug else None,
    redoc_url="/redoc" if app_config.debug else None
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=app_config.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure this properly in production
)

# Static files and templates
if not os.path.exists("static"):
    os.makedirs("static")
if not os.path.exists("templates"):
    os.makedirs("templates")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    logger.info("Starting CoinQuest Finance Tracker...")
    
    # Check database connection
    if not check_db_connection():
        logger.error("Failed to connect to database")
        raise Exception("Database connection failed")
    
    # Initialize database
    init_db()
    logger.info("Database initialized successfully")
    
    logger.info("Application startup complete")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": app_config.version
    }

# Root endpoint - serve web interface
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """Serve the main web interface"""
    return templates.TemplateResponse("index.html", {"request": request})

# Authentication endpoints
@app.post("/api/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    if crud.get_user_by_username(db, user.username):
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )
    
    # Create user
    db_user = crud.create_user(db, user)
    return db_user

@app.post("/api/auth/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return tokens"""
    user = authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@app.get("/api/auth/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user

# Category endpoints
@app.post("/api/categories", response_model=CategoryResponse)
async def create_category(
    category: CategoryCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new category"""
    return crud.create_category(db, category, current_user.id)

@app.get("/api/categories", response_model=List[CategoryResponse])
async def get_categories(
    category_type: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's categories"""
    return crud.get_categories(db, current_user.id, category_type)

@app.get("/api/categories/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific category"""
    category = crud.get_category(db, category_id, current_user.id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@app.put("/api/categories/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    category_update: CategoryUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a category"""
    category = crud.update_category(db, category_id, category_update, current_user.id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@app.delete("/api/categories/{category_id}")
async def delete_category(
    category_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a category"""
    if not crud.delete_category(db, category_id, current_user.id):
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}

# Merchant endpoints
@app.post("/api/merchants", response_model=MerchantResponse)
async def create_merchant(
    merchant: MerchantCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new merchant"""
    return crud.create_merchant(db, merchant, current_user.id)

@app.get("/api/merchants", response_model=List[MerchantResponse])
async def get_merchants(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's merchants"""
    return crud.get_merchants(db, current_user.id)

@app.get("/api/merchants/{merchant_id}", response_model=MerchantResponse)
async def get_merchant(
    merchant_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific merchant"""
    merchant = crud.get_merchant(db, merchant_id, current_user.id)
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
    return merchant

@app.put("/api/merchants/{merchant_id}", response_model=MerchantResponse)
async def update_merchant(
    merchant_id: int,
    merchant_update: MerchantUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a merchant"""
    merchant = crud.update_merchant(db, merchant_id, merchant_update, current_user.id)
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
    return merchant

@app.delete("/api/merchants/{merchant_id}")
async def delete_merchant(
    merchant_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a merchant"""
    if not crud.delete_merchant(db, merchant_id, current_user.id):
        raise HTTPException(status_code=404, detail="Merchant not found")
    return {"message": "Merchant deleted successfully"}

# Transaction endpoints
@app.post("/api/transactions", response_model=TransactionResponse)
async def create_transaction(
    transaction: TransactionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new transaction"""
    return crud.create_transaction(db, transaction, current_user.id)

@app.get("/api/transactions", response_model=List[TransactionResponse])
async def get_transactions(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    transaction_type: Optional[TransactionTypeEnum] = None,
    category_ids: Optional[str] = None,
    merchant_ids: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's transactions with filters"""
    # Parse comma-separated IDs
    category_id_list = [int(x) for x in category_ids.split(",")] if category_ids else None
    merchant_id_list = [int(x) for x in merchant_ids.split(",")] if merchant_ids else None
    
    filters = TransactionFilter(
        start_date=start_date,
        end_date=end_date,
        transaction_type=transaction_type,
        category_ids=category_id_list,
        merchant_ids=merchant_id_list,
        min_amount=min_amount,
        max_amount=max_amount,
        search=search
    )
    
    return crud.get_transactions(db, current_user.id, filters, skip, limit)

@app.get("/api/transactions/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific transaction"""
    transaction = crud.get_transaction(db, transaction_id, current_user.id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@app.put("/api/transactions/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: int,
    transaction_update: TransactionUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a transaction"""
    transaction = crud.update_transaction(db, transaction_id, transaction_update, current_user.id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@app.delete("/api/transactions/{transaction_id}")
async def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a transaction"""
    if not crud.delete_transaction(db, transaction_id, current_user.id):
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted successfully"}

# Budget endpoints
@app.post("/api/budgets", response_model=BudgetResponse)
async def create_budget(
    budget: BudgetCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new budget"""
    return crud.create_budget(db, budget, current_user.id)

@app.get("/api/budgets", response_model=List[BudgetResponse])
async def get_budgets(
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's budgets"""
    return crud.get_budgets(db, current_user.id, month, year)

@app.get("/api/budgets/{budget_id}", response_model=BudgetResponse)
async def get_budget(
    budget_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific budget"""
    budget = crud.get_budget(db, budget_id, current_user.id)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget

@app.put("/api/budgets/{budget_id}", response_model=BudgetResponse)
async def update_budget(
    budget_id: int,
    budget_update: BudgetUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a budget"""
    budget = crud.update_budget(db, budget_id, budget_update, current_user.id)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget

@app.delete("/api/budgets/{budget_id}")
async def delete_budget(
    budget_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a budget"""
    if not crud.delete_budget(db, budget_id, current_user.id):
        raise HTTPException(status_code=404, detail="Budget not found")
    return {"message": "Budget deleted successfully"}

# Dashboard and analytics endpoints
@app.get("/api/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get dashboard data"""
    if not month:
        month = datetime.now().month
    if not year:
        year = datetime.now().year
    
    # Get monthly overview
    monthly_overview = crud.get_monthly_overview(db, current_user.id, month, year)
    
    # Get category spending
    category_spending = crud.get_category_spending(db, current_user.id, month, year)
    
    # Get recent transactions
    recent_transactions = crud.get_transactions(db, current_user.id, limit=5)
    
    return DashboardResponse(
        monthly_overview=MonthlyOverview(**monthly_overview),
        category_spending=[CategorySpending(**cs) for cs in category_spending],
        recent_transactions=recent_transactions
    )

# System logs endpoint (admin only)
@app.get("/api/logs", response_model=List[SystemLogResponse])
async def get_system_logs(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get system logs (admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return crud.get_system_logs(db, skip, limit)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=app_config.host,
        port=app_config.port,
        reload=app_config.debug
    )