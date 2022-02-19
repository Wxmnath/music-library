const { expect } = require("chai");
const request = require("supertest");
const getDb = require("../src/services/db");
const app = require("../src/app");

describe("create artist", () => {
  let db;
  beforeEach(async () => (db = await getDb())); //beforeEach hook will connect to the database before each test, and store that connection as db.

  afterEach(async () => {
    //The afterEach hook will delete all the records in the Artist table after each test has run, and close the database connection.
    await db.query("DELETE FROM Artist");
    await db.close();
  });

  //The test will now query the database to see if there is an artist in the Artist table, and check it contains the data we expect.
  describe("/artist", () => {
    describe("POST", () => {
      it("creates a new artist in the database", async () => {
        console.log("Working");
        const res = await request(app).post("/artist").send({
          name: "Tame Impala",
          genre: "rock",
        });

        expect(res.status).to.equal(201);

        const [[artistEntries]] = await db.query(
          `SELECT * FROM Artist WHERE name = 'Tame Impala'`
        );

        expect(artistEntries.name).to.equal("Tame Impala");
        expect(artistEntries.genre).to.equal("rock");
      });
    });
  });
});
