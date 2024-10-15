CREATE TABLE Cards (
    card_id INT PRIMARY KEY,
    kcc_id INT UNIQUE,
    max_amount INT,
    card_status VARCHAR(100) NOT NULL,
    acces_status VARCHAR(100) NOT NULL
);
