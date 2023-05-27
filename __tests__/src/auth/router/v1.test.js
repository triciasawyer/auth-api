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
  test('Bad requests', async () => {
    const response = await request.post('/api/v1/notFood').send({ info: 'bad' });
    expect(response.status).toEqual(500);
  });


  test('Bad routes', async () => {
    const response = await request.get('/notRoute');
    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual('Sorry, we could not find what you were looking for');
  });


  test('Create a new food', async () => {
    let response = await request.post('/api/v1/food').send({
      name: 'Birthday cake',
      calories: 200,
      type: 'Bakery item',
    });

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('Birthday cake');
    expect(response.body.calories).toEqual(200);
  });


  test('Read all foods', async () => {
    let response = await request.get('/api/v1/food');

    expect(response.status).toEqual(200);
    expect(response.body[0].name).toEqual('Birthday cake');
    expect(response.body[0].calories).toEqual(200);
  });


  test('Read one food', async () => {
    let response = await request.get('/api/v1/food/1');

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Birthday cake');
    expect(response.body.calories).toEqual(200);
  });


  test('Update a food', async () => {
    let response = await request.put('/api/v1/food/1').send({
      name: 'Birthday cake 2.0',
      calories: 300,
      type: 'Bakery item',
    });

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Birthday cake 2.0');
    expect(response.body.calories).toEqual(300);
  });


  test('Delete a food', async () => {
    let response = await request.delete('/api/v1/food/1');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(1);
  });

});
