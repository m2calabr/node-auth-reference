//import {} from 'jest';
//const {} = require('jest');
const mockingoose = require('mockingoose');
const app = require('../app.js');
const supertest = require('supertest')(app);
const api = require('../config/api');

/*
const routerUnderTest = require('../api/Auth')
const supertest = require('supertest');
//const {} = require('jest');
const api = require('../config/api');
const express = require('express');

//import * as supertest from "supertest";
const app = express()
app.use('/', routerUnderTest)
*/

// To wrap the horrible try catch block can use
const supertestWithJest = (err, res, done, asserts) => {
  try {
    expect(err).toBeNull()
    asserts()
    done()
  } catch (err) {
    done.fail(err)
  }
}

//const request = supertest("http://localhost:3000");

describe("GET /", () => {
  it("root should return 200 OK", () => {
    return supertest
      .get('/')
      .expect(200)
      .expect((res) => {
        if (res.body.version===api.version) {
          //all is good
        } else {
          throw new Error('Return api version ('+res.body.version+') did not match config ('+api.version+')');
        }
      });
  });
  it("bad path should return 404", () => {
    return supertest
      .get('/xyzzy')
      .expect(404);
  });
});
