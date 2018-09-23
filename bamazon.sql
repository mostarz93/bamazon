DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
id int NOT NULL AUTO_INCREMENT,
product_name VARCHAR(50) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price DECIMAL (10,2) NOT NULL,
stock_quantity VARCHAR (50) NOT NULL,
PRIMARY KEY (id)

);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE 
("kidney", "urinary", 10000, 40), 
("stomach", "digestive", 40000, 25), 
("lung", "respiratory", "25000", 15), 
("heart", "circulatory", "100000", 5), 
("nerves (30 count)", "nervous", 5000, 70), 
("liver", "endocrine", 30000, 50),
("brain", "nervous", 200000, 100),
("colon", "digestive", 40000, 25),
("appendix", "nervouse", 15, 2000),
("pancreas", "circulatory", 14000, 30 );


INSERT INTO departments (department_name, over_head_costs)
VALUES ("urinary", 2000),
  ("nervous", 1000),
  ("digestive", 500),
  ("respiratory", 3000),
  ("circulatory", 350),
  ("endocrine", 0),
  ("reproductive", 1000),
  ("sensory", 400);
  
  SELECT * FROM departments;


  