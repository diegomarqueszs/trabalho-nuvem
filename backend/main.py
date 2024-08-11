from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date
from sqlalchemy import create_engine, Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError

# Configuração do banco de dados
DATABASE_URL = "mysql+pymysql://root:my-secret-pw@localhost/trabalhofinal"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Modelo SQLAlchemy
class ClienteModel(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), index=True)
    cpf = Column(String(14), unique=True, index=True)
    data_nascimento = Column(Date)
    email = Column(String(100), unique=True, index=True)

# Cria as tabelas, se não existirem
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Modelo Pydantic para validação de dados
class ClienteBase(BaseModel):
    nome: str
    cpf: str
    data_nascimento: date
    email: EmailStr

class ClienteCreate(ClienteBase):
    pass

class Cliente(ClienteBase):
    id: int

    class Config:
        orm_mode = True

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rota para cadastrar um novo cliente
@app.post("/clientes/", response_model=Cliente)
def criar_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = ClienteModel(**cliente.dict())
    try:
        db.add(db_cliente)
        db.commit()
        db.refresh(db_cliente)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_cliente

# Rota para listar todos os clientes
@app.get("/clientes/", response_model=List[Cliente])
def listar_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(ClienteModel).offset(skip).limit(limit).all()

# Rota para buscar um cliente pelo ID
@app.get("/clientes/{cliente_id}", response_model=Cliente)
def buscar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(ClienteModel).filter(ClienteModel.id == cliente_id).first()
    if cliente is None:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return cliente

# Rota para atualizar um cliente
@app.put("/clientes/{cliente_id}", response_model=Cliente)
def atualizar_cliente(cliente_id: int, cliente: ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = db.query(ClienteModel).filter(ClienteModel.id == cliente_id).first()
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    for var, value in vars(cliente).items():
        setattr(db_cliente, var, value) if value else None
    try:
        db.commit()
        db.refresh(db_cliente)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_cliente

# Rota para excluir um cliente
@app.delete("/clientes/{cliente_id}", response_model=dict)
def excluir_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(ClienteModel).filter(ClienteModel.id == cliente_id).first()
    if cliente is None:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    try:
        db.delete(cliente)
        db.commit()
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "Cliente excluído com sucesso"}

# Rota para buscar clientes por nome e/ou CPF
@app.get("/clientes/busca/", response_model=List[Cliente])
def buscar_clientes(nome: Optional[str] = None, cpf: Optional[str] = None, db: Session = Depends(get_db)):
    if nome is None and cpf is None:
        raise HTTPException(status_code=400, detail="Forneça pelo menos um parâmetro de busca")
    
    query = db.query(ClienteModel)
    if nome:
        query = query.filter(ClienteModel.nome.ilike(f"%{nome}%"))
    if cpf:
        query = query.filter(ClienteModel.cpf.ilike(f"%{cpf}%"))
    
    return query.all()