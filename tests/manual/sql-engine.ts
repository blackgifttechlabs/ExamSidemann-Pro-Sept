import { SQLEngine } from '../../src/features/courses/polytechnic/nd-it/database-administration/SQLEngine.js';

const engine = SQLEngine.getInstance();
const code = `-- Creating our tuck shop database
CREATE DATABASE ZimTuckShop;

USE ZimTuckShop;

-- Designing the first table
CREATE TABLE Products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  price DECIMAL(10, 2),
  stock_quantity INT DEFAULT 0
);`;

code.split(';').map(s => s.trim()).filter(s => s.length > 0).forEach(stmt => {
  console.log("EXEC:", stmt);
  const res = engine.execute(stmt);
  console.log("RESULT:", res);
});
