process.env.NODE_ENV = "test";

import supertest from "supertest";
import chai from "chai";


const should = chai.should(); 
// This agent refers to PORT where the vsw-repo is running.

var server = supertest.agent("http://localhost:8062");

// UNIT test begin
describe("vsw-repo unit test", function () {

  // #1 should return home page
  it("should return '/'",  (done) => {
    // calling home page api
    server
      .get("/")
      .expect("Content-type", /json/)
      .expect(200) // This is HTTP response
      .end((err, res) => {
        // HTTP status should be 200
        res.status.should.equal(200);
        // Error key should be false.
        res.body.error.should.equal(false);
        done();
      });
  });

  // #2 should return health
  it("should return '/adminRoutes/health'", function (done) {
    // calling home page api
    server
      .get("/adminRoutes/health")
      .expect("Content-Type",  /json/)
      .expect(200) // This is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        res.status.should.equal(200);
        // Error key should be false.
        res.body.error.should.equal(false);
        done();
      });
  });

   // #2 should return health
   it("should return '/adminRoutes/health'", function (done) {
    // calling home page api
    server
      .get("/adminRoutes/health")
      .expect("Content-Type",  /json/)
      .expect(200) // This is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        res.status.should.equal(200);
        // Error key should be false.
        res.body.error.should.equal(false);
        done();
      });
  });

});