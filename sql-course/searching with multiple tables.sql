CREATE DATABASE shop;
USE shop;

CREATE TABLE customers (
	id INT AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(50),
    PRIMARY KEY(id)
);
CREATE TABLE orders (
	id INT AUTO_INCREMENT,
    order_date DATE DEFAULT (CURRENT_DATE),
    amount DECIMAL(8,2),
    customer_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

INSERT INTO customers (first_name, last_name, email) 
VALUES ('Boy', 'George', 'george@gmail.com'),
       ('George', 'Michael', 'gm@gmail.com'),
       ('David', 'Bowie', 'david@gmail.com'),
       ('Blue', 'Steele', 'blue@gmail.com'),
       ('Bette', 'Davis', 'bette@aol.com');
INSERT INTO orders (order_date, amount, customer_id)
VALUES ('2016-02-10', 99.99, 1),
       ('2017-11-11', 35.50, 1),
       ('2014-12-12', 800.67, 2),
       ('2015-01-03', 12.50, 2),
       ('1999-04-11', 450.25, 5);
       
SELECT first_name, last_name, order_date, amount FROM customers
JOIN orders ON customers.id = orders.customer_id;

SELECT * FROM orders
JOIN customers ON orders.customer_id = customers.id;

SELECT first_name, last_name, SUM(amount) FROM customers
JOIN orders ON customers.id = orders.customer_id GROUP BY first_name, last_name;