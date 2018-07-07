drop database if exists bamazon2;

create database bitemnameamazon2;

use bamazon2;

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

create table auctions2(
id integer not null auto_increment,
itemname varchar(50) not null,
category varchar(50) not null,
startingbid integer default 0,
highestbid integer default 0,
primary key (id)
);

INSERT INTO product (product_name, department_name, price, stock_quantity, in_stock)
values ("Ruby-Quartz Crystal Visor", "X-Men", 99.99, 1, true);