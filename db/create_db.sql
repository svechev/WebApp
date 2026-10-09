CREATE DATABASE IF NOT EXISTS userApp;

USE userApp;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(32) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

INSERT INTO users (username, email, password_hash) VALUES
('Mahiro', 'example@gmail.com', '$argon2id$v=19$m=65536,p=4,t=3$EqA+j8dqJtWgcQ1H3a1IEg$mgY2P0gC9QNlVWn/BJ6+FMQmBefkmAeBKojBSDHNha4');