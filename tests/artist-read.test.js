// tests/artist-read.test.js
const { expect } = require("chai");
const request = require("supertest");
const getDb = require("../src/services/db");
const app = require("../src/app");

describe("read artist", () => {
  let db;
  let artists;

  beforeEach(async () => {
    //Like our last test file, we are using the beforeEach hook to establish a connection to the database before each test.
    db = await getDb();
    await Promise.all([
      //Promise.all method, which will resolve an array of promises. In this case an array of db.query() functions.
      db.query("INSERT INTO Artist (name, genre) VALUES(?, ?)", [
        "Tame Impala",
        "rock",
      ]),
      db.query("INSERT INTO Artist (name, genre) VALUES(?, ?)", [
        "Kylie Minogue",
        "pop",
      ]),
      db.query("INSERT INTO Artist (name, genre) VALUES(?, ?)", [
        "Dave Brubeck",
        "jazz",
      ]),
    ]);
    //Once the above promises have resolved we are querying the database again to get all the artist and storing them in a variable called artist.
    [artists] = await db.query("SELECT * from Artist"); //the artist variable is declared as a let outside of the beforeEach so that it is in the same scope as the tests.
  });

  afterEach(async () => {
    //uses db.query() to delete all the artists in the Artist table, then closes the connection to the database.
    await db.query("DELETE FROM Artist");
    await db.close();
  });

  //Tests sends a GET request to /artist
  describe("/artist", () => {
    describe("GET", () => {
      it("returns all artist records in the database", async () => {
        const res = await request(app).get("/artist").send();

        expect(res.status).to.equal(200); //and expects a 200 response.
        expect(res.body.length).to.equal(3); //it then expects the response body to be an array containing 3 elements.

        res.body.forEach((artistRecord) => {
          const expected = artists.find((a) => a.id === artistRecord.id); //Finally, it checks if each item in the response body matches an item in the artists array.

          expect(artistRecord).to.deep.equal(expected);
        });
      });
    });
  });

  // artist-read.test.js
  describe("/artist/:artistId", () => {
    describe("GET", () => {
      it("returns a single artist with the correct id", async () => {
        const expected = artists[0]; //This first test is looking to see if the returned artist details match artist 0 from the artist array.
        const res = await request(app).get(`/artist/${expected.id}`).send();

        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(expected);
      });

      it("returns a 404 if the artist is not in the database", async () => {
        //This second test is asking for an artist that doesnt exist and expects to get a 404 back.
        const res = await request(app).get("/artist/999999").send();

        expect(res.status).to.equal(404);
      });
    });
  });
});
