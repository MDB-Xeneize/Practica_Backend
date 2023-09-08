-- Creacion de la base de datos
create database backend;


--Creacion de la tablas 
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


 ALTER TABLE usuario ADD COLUMN persona_dni INT, ADD FOREIGN KEY (persona_dni) REFERENCES persona(dni);
