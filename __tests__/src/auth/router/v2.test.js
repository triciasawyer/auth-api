'use strict';


const supertest = require('supertest');
const { server } = require('../../../../src/server');
const { db, users } = require('../../../../src/auth/models/index');
const request = supertest(server);

let adminTest;
let testUser = {};

beforeAll(async () => {
  await db.sync();
  adminTest = await users.create({
    username: 'triciaS',
    password: 'passwordy',
    role: 'admin',
  });
});


afterAll(async () => {
  await db.drop();
});


describe('testing v2 routes', () => {
  test('Bad requests', async () => {
    const response = await request.post('/api/v2/horse').send({ info: 'bad' });
    expect(response.status).toEqual(500);
  });

  // can't get this test passing
  test('Cannot create a new food unless your role allows', async () => {
    let response = await request.post('/api/v2/food').send({
      name: 'Birthday cookie',
      calories: 100,
      type: 'Bakery item',
    }).set('Authorization', `Bearer ${testUser.token}`);

    expect(response.status).toEqual(500);
    expect(response.body.message).toEqual('Access Denied');
  });


  test('Can create a new record', async () => {
    let response = await request.post('/api/v2/food').send({
      name: 'Birthday cake',
      calories: 200,
      type: 'Bakery item',
    }).set('Authorization', `Bearer ${adminTest.token}`);

    expect(response.status).toEqual(201);
    expect(response.body.name).toBe('Birthday cake');
  });


  test('Can get all records', async () => {
    let response = await request.get('/api/v2/food/1').set('Authorization', `Bearer ${adminTest.token}`);

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Birthday cake');
  });


  test('Can get one record', async () => {
    let response = await request.get('/api/v2/food/1').set('Authorization', `Bearer ${adminTest.token}`);

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Birthday cake');
  });


  test('Can update a single record', async () => {
    let response = await  request.put('/api/v2/food/1').send({
      name: 'Birthday cake 2.0',
      calories: 300,
      type: 'Bakery item',
    }).set('Authorization', `Bearer ${adminTest.token}`);

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Birthday cake 2.0');
  });


  test('Can delete a single record', async () => {
    let response = await request.delete('/api/v2/food/1').set('Authorization', `Bearer ${adminTest.token}`);

    expect(response.status).toEqual(200);
  });


});