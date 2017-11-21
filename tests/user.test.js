const mockingoose = require('mockingoose').default; //so we don't call the real mongo db -- otherwise the test will hang
const app = require('../app.js');
const supertest = require('supertest')(app);
const User = require('../Models/User');

describe("POST /users", () => {
  beforeEach(() => {
    mockingoose.resetAll()
    const _doc = {
      _id: '507f191e810c19729de860ea',
      email: 'name@email.com',
      password: 'aaa'
    };
    mockingoose.User.toReturn(_doc); // findById is findOne
  });

  it('should return 200 for a list', () => {
    return supertest
      .get('/users')
      .expect(200);
  });

  it('should return 200 for a existing user', () => {
    return supertest
      .get('/users')
      .query({ _id: '507f191e810c19729de860ea' })
      .expect(200)
      /*
      .expect((err,res) => {
        res.status.should.equal(200);
        res.email.should.equal('name@email.com');
        //done();
        */
      //});
  });

});
