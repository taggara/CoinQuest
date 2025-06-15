from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, func, extract
from datetime import date, datetime
from app.models import User, Transaction, Category, Merchant, Budget, SystemLog
from app.schemas import (
    UserCreate, UserUpdate, TransactionCreate, TransactionUpdate,
    CategoryCreate, CategoryUpdate, MerchantCreate, MerchantUpdate,
    BudgetCreate, BudgetUpdate, TransactionFilter, SystemLogCreate
)
from app.auth import get_password_hash

# User CRUD operations
def create_user(db: Session, user: UserCreate) -> User:
    """Create a new user"""
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        full_name=user.full_name,
        is_active=user.is_active
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int) -> Optional[User]:
    """Get user by ID"""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Get user by username"""
    return db.query(User).filter(User.username == username).first()

def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    """Update user"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

# Category CRUD operations
def create_category(db: Session, category: CategoryCreate, user_id: int) -> Category:
    """Create a new category"""
    db_category = Category(**category.dict(), user_id=user_id)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_categories(db: Session, user_id: int, category_type: Optional[str] = None) -> List[Category]:
    """Get user's categories"""
    query = db.query(Category).filter(Category.user_id == user_id)
    if category_type:
        query = query.filter(Category.type == category_type)
    return query.order_by(Category.name).all()

def get_category(db: Session, category_id: int, user_id: int) -> Optional[Category]:
    """Get category by ID"""
    return db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == user_id
    ).first()

def update_category(db: Session, category_id: int, category_update: CategoryUpdate, user_id: int) -> Optional[Category]:
    """Update category"""
    db_category = get_category(db, category_id, user_id)
    if not db_category:
        return None
    
    update_data = category_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_category, field, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int, user_id: int) -> bool:
    """Delete category"""
    db_category = get_category(db, category_id, user_id)
    if not db_category:
        return False
    
    db.delete(db_category)
    db.commit()
    return True

# Merchant CRUD operations
def create_merchant(db: Session, merchant: MerchantCreate, user_id: int) -> Merchant:
    """Create a new merchant"""
    db_merchant = Merchant(**merchant.dict(), user_id=user_id)
    db.add(db_merchant)
    db.commit()
    db.refresh(db_merchant)
    return db_merchant

def get_merchants(db: Session, user_id: int) -> List[Merchant]:
    """Get user's merchants"""
    return db.query(Merchant).filter(Merchant.user_id == user_id).order_by(Merchant.name).all()

def get_merchant(db: Session, merchant_id: int, user_id: int) -> Optional[Merchant]:
    """Get merchant by ID"""
    return db.query(Merchant).filter(
        Merchant.id == merchant_id,
        Merchant.user_id == user_id
    ).first()

def update_merchant(db: Session, merchant_id: int, merchant_update: MerchantUpdate, user_id: int) -> Optional[Merchant]:
    """Update merchant"""
    db_merchant = get_merchant(db, merchant_id, user_id)
    if not db_merchant:
        return None
    
    update_data = merchant_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_merchant, field, value)
    
    db.commit()
    db.refresh(db_merchant)
    return db_merchant

def delete_merchant(db: Session, merchant_id: int, user_id: int) -> bool:
    """Delete merchant"""
    db_merchant = get_merchant(db, merchant_id, user_id)
    if not db_merchant:
        return False
    
    db.delete(db_merchant)
    db.commit()
    return True

# Transaction CRUD operations
def create_transaction(db: Session, transaction: TransactionCreate, user_id: int) -> Transaction:
    """Create a new transaction"""
    db_transaction = Transaction(**transaction.dict(), user_id=user_id)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_transactions(
    db: Session, 
    user_id: int, 
    filters: Optional[TransactionFilter] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Transaction]:
    """Get user's transactions with filters"""
    query = db.query(Transaction).filter(Transaction.user_id == user_id)
    query = query.options(joinedload(Transaction.category), joinedload(Transaction.merchant))
    
    if filters:
        if filters.start_date:
            query = query.filter(Transaction.date >= filters.start_date)
        if filters.end_date:
            query = query.filter(Transaction.date <= filters.end_date)
        if filters.transaction_type:
            query = query.filter(Transaction.type == filters.transaction_type)
        if filters.category_ids:
            query = query.filter(Transaction.category_id.in_(filters.category_ids))
        if filters.merchant_ids:
            query = query.filter(Transaction.merchant_id.in_(filters.merchant_ids))
        if filters.min_amount:
            query = query.filter(Transaction.amount >= filters.min_amount)
        if filters.max_amount:
            query = query.filter(Transaction.amount <= filters.max_amount)
        if filters.search:
            search_term = f"%{filters.search}%"
            query = query.join(Transaction.merchant).filter(
                or_(
                    Transaction.description.ilike(search_term),
                    Transaction.notes.ilike(search_term),
                    Merchant.name.ilike(search_term)
                )
            )
    
    return query.order_by(Transaction.date.desc()).offset(skip).limit(limit).all()

def get_transaction(db: Session, transaction_id: int, user_id: int) -> Optional[Transaction]:
    """Get transaction by ID"""
    return db.query(Transaction).options(
        joinedload(Transaction.category),
        joinedload(Transaction.merchant)
    ).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == user_id
    ).first()

def update_transaction(db: Session, transaction_id: int, transaction_update: TransactionUpdate, user_id: int) -> Optional[Transaction]:
    """Update transaction"""
    db_transaction = get_transaction(db, transaction_id, user_id)
    if not db_transaction:
        return None
    
    update_data = transaction_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_transaction, field, value)
    
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def delete_transaction(db: Session, transaction_id: int, user_id: int) -> bool:
    """Delete transaction"""
    db_transaction = get_transaction(db, transaction_id, user_id)
    if not db_transaction:
        return False
    
    db.delete(db_transaction)
    db.commit()
    return True

# Budget CRUD operations
def create_budget(db: Session, budget: BudgetCreate, user_id: int) -> Budget:
    """Create a new budget"""
    db_budget = Budget(**budget.dict(), user_id=user_id)
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

def get_budgets(db: Session, user_id: int, month: Optional[int] = None, year: Optional[int] = None) -> List[Budget]:
    """Get user's budgets"""
    query = db.query(Budget).filter(Budget.user_id == user_id)
    query = query.options(joinedload(Budget.category))
    
    if month:
        query = query.filter(Budget.month == month)
    if year:
        query = query.filter(Budget.year == year)
    
    return query.all()

def get_budget(db: Session, budget_id: int, user_id: int) -> Optional[Budget]:
    """Get budget by ID"""
    return db.query(Budget).options(joinedload(Budget.category)).filter(
        Budget.id == budget_id,
        Budget.user_id == user_id
    ).first()

def update_budget(db: Session, budget_id: int, budget_update: BudgetUpdate, user_id: int) -> Optional[Budget]:
    """Update budget"""
    db_budget = get_budget(db, budget_id, user_id)
    if not db_budget:
        return None
    
    update_data = budget_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_budget, field, value)
    
    db.commit()
    db.refresh(db_budget)
    return db_budget

def delete_budget(db: Session, budget_id: int, user_id: int) -> bool:
    """Delete budget"""
    db_budget = get_budget(db, budget_id, user_id)
    if not db_budget:
        return False
    
    db.delete(db_budget)
    db.commit()
    return True

# Analytics and reporting
def get_monthly_overview(db: Session, user_id: int, month: int, year: int) -> Dict[str, Any]:
    """Get monthly financial overview"""
    # Get transactions for the month
    transactions = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        extract('month', Transaction.date) == month,
        extract('year', Transaction.date) == year
    ).all()
    
    income = sum(t.amount for t in transactions if t.type.value == 'income')
    expenses = sum(t.amount for t in transactions if t.type.value == 'expense')
    
    # Get budget total for the month
    budgets = get_budgets(db, user_id, month, year)
    budget_total = sum(b.amount for b in budgets)
    
    return {
        'income': income,
        'expenses': expenses,
        'balance': income - expenses,
        'budget_used': expenses,
        'budget_total': budget_total,
        'transactions_count': len(transactions)
    }

def get_category_spending(db: Session, user_id: int, month: int, year: int) -> List[Dict[str, Any]]:
    """Get spending by category for a month"""
    results = db.query(
        Category.id,
        Category.name,
        func.sum(Transaction.amount).label('total_amount')
    ).join(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'expense',
        extract('month', Transaction.date) == month,
        extract('year', Transaction.date) == year
    ).group_by(Category.id, Category.name).all()
    
    # Get budgets for comparison
    budgets = {b.category_id: b.amount for b in get_budgets(db, user_id, month, year)}
    
    category_spending = []
    for category_id, category_name, amount in results:
        budget_amount = budgets.get(category_id)
        percentage = (amount / budget_amount * 100) if budget_amount else None
        
        category_spending.append({
            'category_id': category_id,
            'category_name': category_name,
            'amount': amount or 0,
            'budget_amount': budget_amount,
            'percentage_of_budget': percentage
        })
    
    return category_spending

# System logging
def create_system_log(db: Session, log: SystemLogCreate, user_id: Optional[int] = None) -> SystemLog:
    """Create a system log entry"""
    db_log = SystemLog(**log.dict(), user_id=user_id)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_system_logs(db: Session, skip: int = 0, limit: int = 100) -> List[SystemLog]:
    """Get system logs"""
    return db.query(SystemLog).order_by(SystemLog.timestamp.desc()).offset(skip).limit(limit).all()