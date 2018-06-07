DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
	id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50),
    price DECIMAL(20,2) NOT NULL,
    quanity INT(15) NOT NULL,
    product_sales DECIMAL(10,2) NOT NULL,
    prod_cost DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE departments(
	id INT NOT NULL AUTO_INCREMENT,
    dpt_name VARCHAR(50) NOT NULL,
    dpt_cost DECIMAL(10,2) NOT NULL,
    dpt_sales INTEGER(15) NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO products(product_name, department_name, price, quanity, product_sales, prod_cost)
VALUES  ("Clorox", "Cleaning", 4.99, 200, 0, 1.35), 
        ("Kit Kats", "Candy", 2.50, 4000, 0, 0.84), 
        ("PS4", "Video Games", 399, 400, 0, 124.32), 
        ("XBOX One", "Video Games", 500, 3000, 0, 232.12),
        ("Walkman", "Electronics", 12.99, 12, 0, 0.49), 
        ("Super Soaker", "Toys", 39, 362, 0, 29.32), 
        ("Slip n Slined", "Outdoor", 29.99, 1234, 0, 12.99), 
        ("Ping Pong Table", "Sports", 120, 32, 0, 109),
        ("Tennis Racquet", "Sports",  209, 23, 0, 102.21), 
        ("Dinosuar Bones", "Misc", 200000000, 12, 0, 3000);


INSERT INTO departments(dpt_name, dpt_cost, dpt_sales)
VALUES  ("Cleaning", 0, 0), 
        ("Candy", 0, 0), 
        ("Video Games", 0, 0), 
        ("Electronics", 0, 0), 
        ("Toys", 0, 0), 
        ("Outdoor", 0, 0), 
        ("Sports", 0, 0), 
        ("Misc", 0, 0);