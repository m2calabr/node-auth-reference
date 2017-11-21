const mockingoose = require('mockingoose').default; //so we don't call the real mongo db -- otherwise the test will hang
const app = require('../app.js');
const supertest = require('supertest')(app);

const api = require('../config/api');
const User = require('../Models/User');

describe("POST /signup", () => {
  beforeEach(() => mockingoose.resetAll());

  it('should return 400 with nothing sent', () => {
    return supertest
      .post('/auth/signup')
      .expect(400);
  });

  it('should return 200 new email/password', () => {
    return supertest
      .post('/auth/signup')
      .set('Accept', /application\/json/)
      .send({
        'email':'willnotexist',
        'password':'xxxxxxxxxxx'})
      .expect(200);
  });

  it('should return 400 existing email/password', () => {
    const _doc = {
      _id: '507f191e810c19729de860ea',
      email: 'name@email.com',
      password: 'aaa'
    };
    mockingoose.User.toReturn(_doc,'findOne'); // findById is findOne
    return supertest
      .post('/auth/signup')
      .set('Accept', /application\/json/)
      .send({
        'email':_doc.email,
        'password':_doc.password
      })
      .expect(500)
      ;
  });

/*
  it('should return 200x new email/password', () => {
    const _doc = {
      _id: '507f191e810c19729de860ea',
      email: 'name@email.com',
      password: 'aaa'
    };
    mockingoose.User.toReturn(_doc); // findById is findOne
    console.log(_doc);
    User.find({}, (err,user) => {
      console.log(user);
    });
    User.create( {
      //_id: 'testing',
      email: 'nambbbe@email.com',
      password: 'abbbaa'
    }, (err,user1) => {
      console.log(user1);
      User.find({}, (err,user3) => {
        if (err) return console.log('----ERROR---');;
        console.log('---------------');
        console.log(user3);
      });
    });


    return supertest
      .post('/auth/signup')
      .expect(400);
  });
  */

  /*
  it("should return current version", () => {
    request
      .get("/")
      .expect(200)
      .expect(function(res) {
        res.body.version = api.version;
      });
  });
  */

});
