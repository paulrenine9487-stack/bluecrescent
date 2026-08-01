-- Blue Crescent Database Schema
-- Database Name: Bluecres

CREATE DATABASE IF NOT EXISTS Bluecres;
USE Bluecres;

-- 1. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. News Table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL
);

-- 4. Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Seed Data from Blue Crescent Website Screenshots

INSERT INTO testimonials (title, content, author_name, company_name) VALUES 
('Excellent Work', 'Blue Crescent has provided us with complete support for MEP drawings, all design Calculations in MEP & Stress Analysis etc in our projects. They are one of the best Engineering company who can be trusted for complete solutions of all Design & Engineering issues. I visited their office & fully satisfied with the Engineering & design team who delivered the works for us on time & also they provided complete support to get approval from various authorities for some woks in very short time. You are Excellent Blue crescent & keep going. Thanks for your works delivered.', 'Gokulraj Chakaravarthy', 'Diplomat Group W.L.L');

INSERT INTO news (title, content) VALUES
('KAHRAMAA Project Tarsheed 2022', 'Blue Crescent Sustainability division is awarded with prestigious KAHRAMAA Project Tarsheed 2022. Blue Crescent is assigned to conduct Energy Audit for 22 schools as a part of Tarsheed 2022 campaign'),
('GSAS Recognition', 'Blue Crescent awarded with GSAS (Global Sustainability Assessment System) recognition for outstanding green building facilitation.');

INSERT INTO services (category, title) VALUES
('Engineering Services', 'Engineering Design support Services'),
('Engineering Services', 'Specialised Simulation & Analysis'),
('Engineering Services', 'Engineering (MEP, Infrastructure, Transportation) shop Drawings - 2D'),
('Engineering Services', 'BIM Modelling - 3D'),
('Engineering Services', 'Outsourcing Technical Experts'),
('Sustainability Services', 'Energy Auditing'),
('Sustainability Services', 'Commissioning of LEED & GSAS'),
('Sustainability Services', 'Green Building Facilitation'),
('Telecom Services', 'Fiber Optic (Indoor & Outdoor)'),
('Telecom Services', 'Cellular (IBS & Outdoor Sites)'),
('Telecom Services', 'Microwave Links'),
('Telecom Services', 'Wi-Fi Systems');
