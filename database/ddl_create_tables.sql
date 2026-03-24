-- Database Creation
CREATE DATABASE IF NOT EXISTS busybrains_assignment;
USE busybrains_assignment;

-- Reset tables 
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'USER'
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL
);

-- Indexes (only useful ones)
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_price ON products(price);

SHOW TABLES;