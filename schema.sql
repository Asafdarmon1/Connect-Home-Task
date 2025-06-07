
CREATE DATABASE hometask;

USE hometask;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  categoryId INT,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS items_volumes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  itemID INT NOT NULL,
  value VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  UNIQUE unique_price_per_item (itemId, price),
  FOREIGN KEY (itemID) REFERENCES items(id) ON DELETE CASCADE
);

INSERT INTO categories (name) VALUES 
("ספורט וכושר"),
("לימודים והעשרה"),
("תרבות ופנאי"),
("אוכל ובישול"),
("בריאות ופינוק");

INSERT INTO items (name, price, categoryId) VALUES
("מנוי חדר כושר בסיסי", 300.00, 1),
("קפיצה בחבל", 100.00, 1),
("קורס תכנות", 550.00, 2),
("קורס אונליין בגיטרה", 150.00, 2),
("מנוי ספרים דיגיטליים", 70.00, 3),
("מנוי קולנוע", 250.00, 3),
("קורס אפייה למתחילים", 300.00, 4),
("סדנת בישול איטליה", 500.00, 4),
("מנוי ספא", 700.00, 5),
("חבילת עיסוי", 450.00, 5);


INSERT INTO items_volumes (itemId, value, price) VALUES
(1, "10 כניסות", 100.00),
(2, "7 ימים קפיצה למתחילים", 120.00),
(3, "גישה ל90 יום", 200.00),
(4, "מסלול מלא", 15.00),
(5, "חודש 1", 70.00),
(6, "כניסה חופשית", 250.00),
(7, "4 שיעורים", 110.00),
(8, "סדנת ערב אחת", 1100.00),
(9, "חודש אחד", 180.00),
(10, "טיפול יחיד", 100.00);
