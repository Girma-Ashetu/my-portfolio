-- Create Database
CREATE DATABASE IF NOT EXISTS portfolio_ga_v2;
USE portfolio_ga_v2;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    technologies VARCHAR(255) NOT NULL,
    link VARCHAR(255),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Insert initial admin (password: admin123 - should be hashed in production)
-- I will provide a script to hash and insert the admin properly later.
INSERT INTO admins (username, password) VALUES ('admin', '$2a$10$7/l.r/1WzJ.pP.W.o8W.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.');
