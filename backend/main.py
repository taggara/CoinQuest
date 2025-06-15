from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
from datetime import datetime, date
import os

from database import get_db, engine
from models import Base, Transaction, Category, Merchant, Budget
from schemas import (
    TransactionCreate, TransactionResponse, TransactionUpdate,
    CategoryCreate, CategoryResponse,
    MerchantCreate, MerchantResponse,
    BudgetCreate, BudgetResponse,
    MonthlyDataResponse
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CoinQuest Finance API", version="1.0.0")

# CORS middleware - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Transaction endpoints
@app.get("/api/transactions", response_model=List[TransactionResponse])
def get_transactions(
    skip: int = 0,
    limit: int = 100,
    transaction_type: Optional[str] = None,
    category_id: Optional[int] = None,
    merchant_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Transaction)
    
    if transaction_type:
        query = query.filter(Transaction.type == transaction_type)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if merchant_id:
        query = query.filter(Transaction.merchant_id == merchant_id)
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    
    transactions = query.order_by(Transaction.date.desc()).offset(skip).limit(limit).all()
    return transactions

@app.get("/api/transactions/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@app.post("/api/transactions", response_model=TransactionResponse)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.put("/api/transactions/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int, 
    transaction: TransactionUpdate, 
    db: Session = Depends(get_db)
):
    db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    for key, value in transaction.dict(exclude_unset=True).items():
        setattr(db_transaction, key, value)
    
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.delete("/api/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    db.delete(db_transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}

# Category endpoints
@app.get("/api/categories", response_model=List[CategoryResponse])
def get_categories(
    transaction_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Category)
    if transaction_type:
        query = query.filter(Category.type == transaction_type)
    return query.all()

@app.post("/api/categories", response_model=CategoryResponse)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# Merchant endpoints
@app.get("/api/merchants", response_model=List[MerchantResponse])
def get_merchants(db: Session = Depends(get_db)):
    return db.query(Merchant).all()

@app.post("/api/merchants", response_model=MerchantResponse)
def create_merchant(merchant: MerchantCreate, db: Session = Depends(get_db)):
    db_merchant = Merchant(**merchant.dict())
    db.add(db_merchant)
    db.commit()
    db.refresh(db_merchant)
    return db_merchant

@app.put("/api/merchants/{merchant_id}", response_model=MerchantResponse)
def update_merchant(
    merchant_id: int,
    merchant: MerchantCreate,
    db: Session = Depends(get_db)
):
    db_merchant = db.query(Merchant).filter(Merchant.id == merchant_id).first()
    if not db_merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
    
    for key, value in merchant.dict().items():
        setattr(db_merchant, key, value)
    
    db.commit()
    db.refresh(db_merchant)
    return db_merchant

@app.delete("/api/merchants/{merchant_id}")
def delete_merchant(merchant_id: int, db: Session = Depends(get_db)):
    db_merchant = db.query(Merchant).filter(Merchant.id == merchant_id).first()
    if not db_merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
    
    db.delete(db_merchant)
    db.commit()
    return {"message": "Merchant deleted successfully"}

# Budget endpoints
@app.get("/api/budgets", response_model=List[BudgetResponse])
def get_budgets(
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Budget)
    if month is not None:
        query = query.filter(Budget.month == month)
    if year is not None:
        query = query.filter(Budget.year == year)
    return query.all()

@app.post("/api/budgets", response_model=BudgetResponse)
def create_budget(budget: BudgetCreate, db: Session = Depends(get_db)):
    db_budget = Budget(**budget.dict())
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

# Dashboard data endpoint
@app.get("/api/dashboard/monthly", response_model=MonthlyDataResponse)
def get_monthly_data(
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    if month is None:
        month = datetime.now().month
    if year is None:
        year = datetime.now().year
    
    # Get transactions for the specified month/year
    transactions = db.query(Transaction).filter(
        Transaction.date >= date(year, month, 1),
        Transaction.date < date(year, month + 1, 1) if month < 12 else date(year + 1, 1, 1)
    ).all()
    
    income = sum(t.amount for t in transactions if t.type == 'income')
    expenses = sum(t.amount for t in transactions if t.type == 'expense')
    
    # Get budget total for the month
    budgets = db.query(Budget).filter(
        Budget.month == month,
        Budget.year == year
    ).all()
    budget_total = sum(b.amount for b in budgets)
    
    return MonthlyDataResponse(
        income=income,
        expenses=expenses,
        balance=income - expenses,
        budget_used=expenses,
        budget_total=budget_total
    )

# Health check endpoint
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "CoinQuest API is running"}

if __name__ == "__main__":
    port = int(os.getenv("BACKEND_PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    print(f"Starting CoinQuest API on {host}:{port}")
    uvicorn.run(app, host=host, port=port, reload=False)