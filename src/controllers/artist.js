const getDb = require("../services/db");

exports.create = async (req, res) => {
  const db = await getDb();
  const { name, genre } = req.body;

  try {
    await db.query(`INSERT INTO Artist (name, genre) VALUES (?, ?)`, [
      // We put a ? at any point where we want to add a variable to our
      // statement. Then we provide those variables in an array as the second argument to db.query(). mysql2 then automatically escapes any
      // strings that are being passed into the statement, thereby preventing any malicious SQL being executed by the database.
      name,
      genre,
    ]);

    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500).json(err);
  }

  db.close();
};
