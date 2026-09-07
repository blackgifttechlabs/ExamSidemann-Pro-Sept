const alasql = require('alasql');

const query = `CREATE TABLE Students (
    student_id   INT PRIMARY KEY AUTO_INCREMENT,
    full_name     VARCHAR(255) NOT NULL,
    email         VARCHAR(255) UNIQUE,
    phone_number  VARCHAR(20),
    city          VARCHAR(100)
)`;

try {
  let res = alasql(query);
  console.log("Success:", res);
} catch (e) {
  console.error("Error:", e.message);
}
