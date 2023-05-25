'use strict';

const supertest = require('supertest');
const { server } = require('../../../../src/server');
const { db } = require('../../../../src/auth/models');
const request = supertest(server);

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

describe('Testing v1 REST API', () => {
  test('Handles bad routes', async () => {
    const response = await request.get('/bad');
    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual('Sorry, we could not find what you were looking for');
  });

  test('Handles bad requests', async () => {
    const response = await request.post('/api/v1/horse').send({ info: 'bad' });
    expect(response.status).toEqual(500);
  });

  test('Create a new food', async () => {
    let response = await request.post('/api/v1/food').send({
      name: 'banana',
      calories: 105,
      type: 'fruit',
    });
    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('banana');
    expect(response.body.calories).toEqual(105);
    expect(response.body.type).toEqual('fruit');
  });

  test('Read all foods', async () => {
    let response = await request.get('/api/v1/food');
    expect(response.status).toEqual(200);
    expect(response.body[0].name).toEqual('banana');
    expect(response.body[0].calories).toEqual(105);
    expect(response.body[0].type).toEqual('fruit');
  });

  test('Read one food', async () => {
    let response = await request.get('/api/v1/food/1');
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('banana');
    expect(response.body.calories).toEqual(105);
    expect(response.body.type).toEqual('fruit');
  });

  test('Update a food', async () => {
    let response = await request.put('/api/v1/food/1').send({
      name: 'two bananas',
      calories: 210,
      type: 'fruit',
    });
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('two bananas');
    expect(response.body.calories).toEqual(210);
    expect(response.body.type).toEqual('fruit');
  });

  test('Delete a food', async () => {
    let response = await request.delete('/api/v1/food/1');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(1);
  });
});
