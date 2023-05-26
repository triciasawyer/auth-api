'use strict';


process.env.SECRET = 'TEST_SECRET';

const { db } = require('../../../../src/auth/models');
const supertest = require('supertest');
const server = require('../../../../src/server.js').server;

const mockRequest = supertest(server);

let userData = {
  testUser: { username: 'user', password: 'password', role: 'admin' },
};
let accessToken = null;

beforeAll(async () => {
  await db.sync();
});
afterAll(async () => {
  await db.drop();
});


describe('Auth Router', () => {
  test('Can create a new user', async () => {
    const response = await mockRequest.post('/signup').send(userData.testUser);
    const userObject = response.body;

    expect(response.status).toBe(201);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(userData.testUser.username);
  });


  test('Can signin with basic auth string', async () => {
    let { username, password } = userData.testUser;
    const response = await mockRequest.post('/signin')
      .auth(username, password);

    const userObject = response.body;

    expect(response.status).toBe(200);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(username);
  });


  test('Can signin with bearer auth token', async () => {
    let { username, password } = userData.testUser;

    // First, use basic to login to get a token
    const response = await mockRequest.post('/signin')
      .auth(username, password);

    accessToken = response.body.token;

    // First, use basic to login to get a token
    const bearerResponse = await mockRequest
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(bearerResponse.status).toBe(200);
  });



});
