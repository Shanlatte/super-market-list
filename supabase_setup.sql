-- SQL to create the tables for the Supermarket List app
-- Run this in your Supabase SQL Editor

-- 1. Create Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Supermarkets table
CREATE TABLE IF NOT EXISTS supermarkets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  supermarket_id UUID REFERENCES supermarkets(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial data (optional)
INSERT INTO categories (name) VALUES ('Comida'), ('Limpieza'), ('Higiene'), ('Mascotas') ON CONFLICT DO NOTHING;
INSERT INTO supermarkets (name) VALUES ('Bravo'), ('Nacional'), ('Sirena'), ('Jumbo') ON CONFLICT DO NOTHING;
