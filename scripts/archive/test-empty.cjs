const alasql = require('alasql');
alasql("CREATE TABLE test (id INT, name STRING)");
const ast = alasql.parse("SELECT * FROM test");
console.log(ast.statements[0].from[0].tableid);
