const mysql = require("mysql2/promise");

const { DB_PASSWORD, DB_USER, DB_NAME, DB_HOST, DB_PORT } = process.env;

module.exports = async () => {
  //This exports an async function that we can use to connect to the database in other parts of our app.
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME, //Note that we have added the DB_NAME as an additional parameter to the connection. This connects directly to the database rather than the MySQL server.
  });

  return connection;
};
