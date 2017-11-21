const mockingoose = require('mockingoose').default; //so we don't call the real mongo db -- otherwise the test will hang
const app = require('../app.js');
const supertest = require('supertest')(app);
const User = require('../Models/User');
const securePassword = require('secure-password');
const passportConfig = require('../config/passport');
const pwd = securePassword({
  memlimit: passportConfig.memlimit,
  opslimit: passportConfig.opslimit
});
describe("POST /validateToken", () => {

  it('should return 200 with valid token', () => {
    //only need to set the fields needed to generate the token
    const user = {
      _id: '507f191e810c19729de860ea',
      email: 'name@email.com',
      password: 'dont matter what this is set to'
    };
    mockingoose.User.toReturn(user,'findOne'); // User must be in the DB to be valid
    const token = User.generateToken(user);
    //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxOTFlODEwYzE5NzI5ZGU4NjBlYSIsImV4cCI6MTUxMTE0OTk4Miwic2NvcGVzIjpbXSwiaWF0IjoxNTExMTQ2MzgyfQ.XIdIoBfwzPuhqirN26mWYEVP0IoAge8R_cqbR8VIjS0';
    return supertest
      .post('/auth/validateToken')
      .set('authorization', token)
      .expect(200);
  });

  it('should return 401 with bad token', () => {
    const token = 'bad token';
    return supertest
      .post('/auth/validateToken')
      .set('authorization', token)
      .expect(401);
  });

});

describe("POST /signin", () => {
  beforeEach(
    () => {mockingoose.resetAll();}
  );

  it('should return 401 with nothing sent', () => {
    return supertest
      .post('/auth/signin')
      .expect(401);
  });

  it('should return 401 unknow email/password', () => {
    return supertest
      .post('/auth/signin')
      .set('Accept', /application\/json/)
      .send({
        'email':'willnotexist',
        'password':'xxxxxxxxxxx'})
      .expect(401);
  });

  it('should return 200 existing email/password', () => {
    const password = '12345678'
    const passwordCypher = User.testHash(password);

    const _doc = {
      _id: '507f191e810c19729de860ea',
      email: 'name@email.com',
      password: passwordCypher
    };

    mockingoose.User.toReturn(_doc,'findOne'); // findById is findOne
    return supertest
      .post('/auth/signin')
      .set('Accept', /application\/json/)
      .send({
        'email':_doc.email,
        'password': password
      })
      .expect(200)
      ;
  });

  it('should return 401 existing email, but bad password', () => {
    const password = '12345678'
    const passwordCypher = User.testHash(password);
    const _doc = {
      _id: '507f191e810c19729de860ea',
      email: 'name@email.com',
      password: passwordCypher
    };

    mockingoose.User.toReturn(_doc,'findOne'); // findById is findOne
    return supertest
      .post('/auth/signin')
      .set('Accept', /application\/json/)
      .send({
        'email':_doc.email,
        'password': password+'x'
      })
      .expect(401)
      ;
  });

  it('should return 401 bad DB hash', () => {
    const password = '12345678'

    //setup user with bcypt has not used by this system
    const _doc = {
      _id: '507f191e810c19729de860ea',
      email: 'name@email.com',
      password: "$2a$10$hWkDssFRYDiACGOt/lKIJetkXeki2V8HFuRzdZ2M2.agtp/AC6Tta"
    };


    mockingoose.User.toReturn(_doc,'findOne'); // findById is findOne
    return supertest
      .post('/auth/signin')
      .set('Accept', /application\/json/)
      .send({
        'email':_doc.email,
        'password': password
      })
      .expect(401)
      ;
  });



});
