'use strict';


process.env.SECRET = 'TEST_SECRET';

const { db } = require('../../../../src/auth/models');
const supertest = require('supertest');
const server = require('../../../../src/server.js').server;

const request = supertest(server);


beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});


describe('Auth Router', () => {
  test('A user can signup', async () => {
    let response = await request.post('/signup').send({
      username: 'tricia',
      password: 'passyword',
      role: 'admin',
    });

    expect(response.status).toBe(201);
    expect(response.body.user.username).toEqual('tricia');
    expect(response.body.user.role).toEqual('admin');
  });


  test('A user can signin', async () => {
    let response = await request.post('/signin').auth('tricia', 'passyword');

    expect(response.status).toBe(200);
    expect(response.body.user.username).toEqual('tricia');
  });


});
