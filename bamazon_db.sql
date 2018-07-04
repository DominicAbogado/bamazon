drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products(
-- item ID --
id integer not null auto_increment,
product_name VARCHAR(50) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price integer(100),
stock_quantity integer(100),
in_stock BOOLEAN default true NOT NULL,
primary key (id)

);

INSERT INTO products (product_name, department_name, price, stock_quantity, in_stock)
values ("Ruby-Quartz Crystal Visor", "X-Men", 99.99, 1, true);