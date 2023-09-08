create database backend;
create table persona(
 dni INT primary key,
 nombre VARCHAR(30) NOT NULL,
 apellido VARCHAR(30) NOT NULL
 );
 
 create table usuario(
 mail VARCHAR(40)  primary key,
 nickname VARCHAR(30) NOT NULL,
 password VARCHAR(30) NOT NULL
 );
