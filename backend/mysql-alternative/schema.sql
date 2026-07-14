-- ==========================================================
-- MySQL alternative schema (use this instead of MongoDB if
-- you prefer a relational database)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS sme_news CHARACTER SET utf8mb4;
USE sme_news;

CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  body LONGTEXT,
  category VARCHAR(100) NOT NULL,
  image VARCHAR(500),
  author VARCHAR(150) DEFAULT 'SME News',
  is_featured BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_created_at ON articles(created_at);

-- Sample seed data
INSERT INTO articles (title, excerpt, category, is_featured, is_popular, views) VALUES
('ក្រុមហ៊ុនកសិកម្មចុះកិច្ចសន្យាទិញលក់ស្រូវទំហំធំជាមួយសហគមន៍មូលដ្ឋាន', 'កិច្ចព្រមព្រៀងនេះរំពឹងជួយបង្កើនប្រាក់ចំណូលកសិករនៅតំបន់ជនបទ។', 'សេដ្ឋកិច្ច', TRUE, FALSE, 320),
('ការិយាល័យឌីជីថលថ្មីជួយសហគ្រាសខ្នាតតូចគ្រប់គ្រងគណនេយ្យតាមអនឡាញ', 'កម្មវិធីនេះផ្តល់ជូនដោយឥតគិតថ្លៃសម្រាប់សហគ្រិនចាប់ផ្តើមអាជីវកម្ម។', 'បច្ចេកវិទ្យា', FALSE, FALSE, 210),
('ធនាគារជាតិណែនាំវិធានការថ្មីគាំទ្រការផ្តល់កម្ចីដល់សហគ្រាសខ្នាតតូច', 'វិធានការនេះមានគោលដៅកាត់បន្ថយការប្រថុយប្រថានសម្រាប់ធនាគារពាណិជ្ជ។', 'ធនាគារ-ហិរញ្ញវត្ថុ', FALSE, TRUE, 540),
('ពិព័រណ៍ពាណិជ្ជកម្មតំបន់ទាក់ទាញអ្នកចូលរួមជាង ៣០០សហគ្រាស', 'ព្រឹត្តិការណ៍នេះជាឱកាសសម្រាប់សហគ្រិនក្នុងស្រុកបង្ហាញផលិតផលរបស់ខ្លួន។', 'ពាណិជ្ជកម្ម', FALSE, TRUE, 480),
('គំនិតអាជីវកម្មខ្នាតតូចដែលកំពុងពេញនិយមក្នុងចំណោមយុវជនកម្ពុជា', 'ការស្ទង់មតិថ្មីបង្ហាញពីនិន្នាការជ្រើសរើសអាជីវកម្មរបស់យុវជន។', 'គំនិតអាជីវកម្ម', FALSE, FALSE, 175),
('កម្មវិធីបណ្តុះបណ្តាលជំនាញវិជ្ជាជីវៈពង្រីកទៅដល់ខេត្តជាច្រើនទៀត', 'គោលដៅគឺបង្កើនលទ្ធភាពការងារសម្រាប់យុវជនតាមបណ្តាខេត្ត។', 'សង្គមជាតិ-សេដ្ឋកិច្ច', FALSE, TRUE, 390);
