CREATE TABLE Logs (
    log_id INT PRIMARY KEY,
    log_time DATETIME NOT NULL,
    tower_id INT NOT NULL,
    tower_status VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    card_id INT NOT NULL,
    card_status VARCHAR(100) NOT NULL,
    acces_status VARCHAR(100) NOT NULL,
    FOREIGN KEY (tower_id) REFERENCES Tower(tower_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (card_id) REFERENCES Cards(card_id)
);
