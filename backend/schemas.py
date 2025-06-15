from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

# Transaction schemas
class TransactionBase(BaseModel):
    date: date
    type: str
    amount: float
    category_id: int
    merchant_id: int
    notes: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    date: Optional[date] = None
    type: Optional[str] = None
    amount: Optional[float] = None
    category_id: Optional[int] = None
    merchant_id: Optional[int] = None
    notes: Optional[str] = None

class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime
    category: Optional[dict] = None
    merchant: Optional[dict] = None
    
    class Config:
        from_attributes = True

# Category schemas
class CategoryBase(BaseModel):
    name: str
    type: str

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Merchant schemas
class MerchantBase(BaseModel):
    name: str
    category: Optional[str] = None

class MerchantCreate(MerchantBase):
    pass

class MerchantResponse(MerchantBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Budget schemas
class BudgetBase(BaseModel):
    category_id: int
    amount: float
    month: int
    year: int

class BudgetCreate(BudgetBase):
    pass

class BudgetResponse(BudgetBase):
    id: int
    created_at: datetime
    category: Optional[dict] = None
    
    class Config:
        from_attributes = True

# Dashboard schemas
class MonthlyDataResponse(BaseModel):
    income: float
    expenses: float
    balance: float
    budget_used: float
    budget_total: float