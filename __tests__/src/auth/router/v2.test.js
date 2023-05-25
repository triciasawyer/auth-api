'use strict';

const supertest = require('supertest');
const { server } = require('../../../../src/server');
const { db } = require('../../../../src/auth/models');
const request = supertest(server);

let testUser = {};
let testAdmin = {};

beforeAll(async () => {
  await db.sync();

  let userData = {
    testUser: { username: 'user', password: 'password', role: 'user' },
    testAdmin: { username: 'admin', password: 'password', role: 'admin' },
  };
  await request.post('/signup').send(userData.testUser);
  const responseUser = await request.post('/signin').auth(userData.testUser.username, userData.testUser.password);
  testUser = responseUser.body;

  await request.post('/signup').send(userData.testAdmin);
  const responseAdmin = await request.post('/signin').auth(userData.testAdmin.username, userData.testAdmin.password);
  testAdmin = responseAdmin.body;
});

afterAll(async () => {
  await db.drop();
});


describe('Test v2 REST API', () => {
  test('Handles bad requests', async () => {
    const response = await request.post('/api/v2/horse').send({ info: 'bad' });

    expect(response.status).toEqual(500);
  });


  test('Prevent creating a new food with wrong acl role', async () => {
    let response = await request.post('/api/v2/food').send({
      name: 'banana',
      calories: 105,
      type: 'fruit',
    }).set('Authorization', `Bearer ${testUser.token}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual('Access Denied');
  });


  test('Can create a new food with correct acl role', async () => {
    let response = await request.post('/api/v2/food').send({
      name: 'banana',
      calories: 105,
      type: 'fruit',
    }).set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('banana');
    expect(response.body.calories).toEqual(105);
    expect(response.body.type).toEqual('fruit');
  });


  test('Can read all foods', async () => {
    let response = await request.get('/api/v2/food').set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(200);
    expect(response.body[0].name).toEqual('banana');
    expect(response.body[0].calories).toEqual(105);
    expect(response.body[0].type).toEqual('fruit');
  });


  test('Can read one food', async () => {
    let response = await request.get('/api/v2/food/1').set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('banana');
    expect(response.body.calories).toEqual(105);
    expect(response.body.type).toEqual('fruit');
  });


  test('Can update a food', async () => {
    let response = await request.put('/api/v2/food/1').send({
      name: 'two bananas',
      calories: 210,
      type: 'fruit',
    }).set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('two bananas');
    expect(response.body.calories).toEqual(210);
    expect(response.body.type).toEqual('fruit');
  });


  test('Can delete a food', async () => {
    let response = await request.delete('/api/v2/food/1').set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(1);
  });
});
