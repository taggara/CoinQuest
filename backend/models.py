from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    type = Column(String, nullable=False)  # 'expense' or 'income'
    amount = Column(Float, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    merchant_id = Column(Integer, ForeignKey("merchants.id"), nullable=False)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    category = relationship("Category", back_populates="transactions")
    merchant = relationship("Merchant", back_populates="transactions")

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    type = Column(String, nullable=False)  # 'expense' or 'income'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    transactions = relationship("Transaction", back_populates="category")
    budgets = relationship("Budget", back_populates="category")

class Merchant(Base):
    __tablename__ = "merchants"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    category = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    transactions = relationship("Transaction", back_populates="merchant")

class Budget(Base):
    __tablename__ = "budgets"
    
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    amount = Column(Float, nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    category = relationship("Category", back_populates="budgets")