CREATE TABLE typing_test(
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL
);

CREATE TABLE typing_test_result(
    id INT AUTO_INCREMENT PRIMARY KEY,
    wpm FLOAT NOT NULL,
    accuracy FLOAT NOT NULL,
    duration FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    test INT NOT NULL,

    CONSTRAINT FK_typing_test_result_test FOREIGN KEY (test) REFERENCES typing_test(id)
);