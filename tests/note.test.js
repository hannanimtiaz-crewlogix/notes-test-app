var chai = require("chai");
var request = require("supertest-session");

var expect = chai.expect;

request = request("http://localhost:3000");

var app = null;
beforeEach(function () {
  app = request;
});

let token;
let note_id;

describe("Notes test", () => {
  it("should log in", (done) => {
    app
      .post("/login")
      .send({ email: "hannan@email.com", password: "hEllo!23" })
      .end((err, res) => {
        expect(res.body.status).to.be.a.string("success");
        token = res.body.token;
        done();
      });
  });

  console.log("token: ", token);
  it("should create a note", (done) => {
    app
      .post("/create-note")
      .set("Authorization", `Bearer ${token}`)
      .send({
        user_id: "61bb15bbabe5912f1328558c",
        title: "This is a mocha title",
        description: "This is a mocha test note",
      })
      .end((err, res) => {
        expect(res.body.status).to.be.a.string("success");
        note_id = res.body.note._id;
        done();
      });
  });

  it("should get note", (done) => {
    app
      .post("/get-note")
      .set("Authorization", `Bearer ${token}`)
      .send({
        user_id: "61bb15bbabe5912f1328558c",
        _id: note_id,
      })
      .end((err, res) => {
        expect(res.body.status).to.be.a.string("success");
        done();
      });
  });
});
