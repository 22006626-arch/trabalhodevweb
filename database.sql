CREATE DATABASE IF NOT EXISTS gemeos_aniversario;
USE gemeos_aniversario;

CREATE TABLE IF NOT EXISTS gemeos_salvos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    detalhes TEXT,
    data_descoberta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
