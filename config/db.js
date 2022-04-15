const { createPool } = require("mysql");
const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DATABASE,
});

pool.getConnection((err) => {
  if (err) {
    console.log("Error connecting to db...");
  }
  console.log("Connected to db...");
});

const executeQuery = (query, statement) => {
  return new Promise((resolve, reject) => {
    try {
      pool.query(query, statement, (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(result);
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { executeQuery };
