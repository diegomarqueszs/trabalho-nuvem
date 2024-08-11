clientes-- Criação do banco de dados
CREATE DATABASE trabalhofinal;

-- Uso do banco de dados criado
USE trabalhofinal;

-- Criação da tabela 'clientes'
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento DATE,
    email VARCHAR(100) NOT NULL UNIQUE,
    INDEX (nome),
    INDEX (cpf),
    INDEX (email)
);
