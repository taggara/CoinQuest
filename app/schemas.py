from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

# Enums
class TransactionTypeEnum(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"

class CategoryTypeEnum(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"

class LogLevelEnum(str, Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    DEBUG = "debug"

# Base schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    is_active: bool = True

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

# Category schemas
class CategoryBase(BaseModel):
    name: str
    type: CategoryTypeEnum
    color: str = "#0ea5e9"
    icon: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Merchant schemas
class MerchantBase(BaseModel):
    name: str
    category_name: Optional[str] = None
    website: Optional[str] = None
    notes: Optional[str] = None

class MerchantCreate(MerchantBase):
    pass

class MerchantUpdate(BaseModel):
    name: Optional[str] = None
    category_name: Optional[str] = None
    website: Optional[str] = None
    notes: Optional[str] = None

class MerchantResponse(MerchantBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Transaction schemas
class TransactionBase(BaseModel):
    date: date
    type: TransactionTypeEnum
    amount: float
    description: Optional[str] = None
    notes: Optional[str] = None
    category_id: int
    merchant_id: int
    
    @validator('amount')
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError('Amount must be positive')
        return round(v, 2)

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    date: Optional[date] = None
    type: Optional[TransactionTypeEnum] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    category_id: Optional[int] = None
    merchant_id: Optional[int] = None
    
    @validator('amount')
    def validate_amount(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Amount must be positive')
        return round(v, 2) if v is not None else v

class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    receipt_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: CategoryResponse
    merchant: MerchantResponse
    
    class Config:
        from_attributes = True

# Budget schemas
class BudgetBase(BaseModel):
    amount: float
    month: int
    year: int
    alert_threshold: float = 0.8
    category_id: int
    
    @validator('amount')
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError('Budget amount must be positive')
        return round(v, 2)
    
    @validator('month')
    def validate_month(cls, v):
        if not 1 <= v <= 12:
            raise ValueError('Month must be between 1 and 12')
        return v
    
    @validator('alert_threshold')
    def validate_threshold(cls, v):
        if not 0 < v <= 1:
            raise ValueError('Alert threshold must be between 0 and 1')
        return v

class BudgetCreate(BudgetBase):
    pass

class BudgetUpdate(BaseModel):
    amount: Optional[float] = None
    alert_threshold: Optional[float] = None
    
    @validator('amount')
    def validate_amount(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Budget amount must be positive')
        return round(v, 2) if v is not None else v

class BudgetResponse(BudgetBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: CategoryResponse
    
    class Config:
        from_attributes = True

# Dashboard schemas
class MonthlyOverview(BaseModel):
    income: float
    expenses: float
    balance: float
    budget_used: float
    budget_total: float
    transactions_count: int

class CategorySpending(BaseModel):
    category_id: int
    category_name: str
    amount: float
    budget_amount: Optional[float] = None
    percentage_of_budget: Optional[float] = None

class DashboardResponse(BaseModel):
    monthly_overview: MonthlyOverview
    category_spending: List[CategorySpending]
    recent_transactions: List[TransactionResponse]

# System log schemas
class SystemLogCreate(BaseModel):
    level: LogLevelEnum
    message: str
    details: Optional[str] = None
    component: Optional[str] = None

class SystemLogResponse(BaseModel):
    id: int
    timestamp: datetime
    level: LogLevelEnum
    message: str
    details: Optional[str] = None
    component: Optional[str] = None
    user_id: Optional[int] = None
    
    class Config:
        from_attributes = True

# Filter schemas
class TransactionFilter(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    transaction_type: Optional[TransactionTypeEnum] = None
    category_ids: Optional[List[int]] = None
    merchant_ids: Optional[List[int]] = None
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
    search: Optional[str] = None

class PaginationParams(BaseModel):
    skip: int = 0
    limit: int = 100
    
    @validator('limit')
    def validate_limit(cls, v):
        if v > 1000:
            raise ValueError('Limit cannot exceed 1000')
        return v