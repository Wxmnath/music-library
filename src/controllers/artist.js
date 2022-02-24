const res = require("express/lib/response");
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

exports.read = async (_, res) => {
  const db = await getDb();

  try {
    const [artists] = await db.query("SELECT * FROM Artist");

    res.status(200).json(artists);
  } catch (err) {
    res.status(500).json(err);
  }
  db.close();
};

//
exports.readById = async (req, res) => {
  const db = await getDb();
  const { artistId } = req.params;
  //To pass this test artist has been removed from the array(destructure) before sending the data to the repsonse.
  const [[artist]] = await db.query("SELECT * FROM Artist WHERE id = ?", [
    artistId, //Controller uses db.query() to SELECT everything from the artist table WHERE the id matches req.params.artistId.
  ]);

  if (!artist) {
    res.status(404);
  } else {
    res.status(200).json(artist);
  }
  db.close();
};
