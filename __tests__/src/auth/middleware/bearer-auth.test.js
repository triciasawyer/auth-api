'use strict';

process.env.SECRET = 'TEST_SECRET';

const bearer = require('../../../../src/auth/middleware/bearer.js');
const { db, users } = require('../../../../src/auth/models/index.js');
const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const server = require('../../../../src/server.js').server;

const request = supertest(server);


let userInfo = {
  admin: { username: 'admin', password: 'password', role: 'admin'},
};

beforeAll(async () => {
  await db.sync();
  await users.create(userInfo.admin);
});

afterAll(async () => {
  await db.drop();
});


describe('Auth Middleware', () => {
  let req = {};
  let res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  const next = jest.fn();


  describe('user authentication', () => {
    test('Failed to login due to incorrect token', async () => {
      req.headers = {
        authorization: 'Bearer thisisabadtoken',
      };

      await bearer(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });


    test('Successfully logged in with token', async () => {
      let user = { username: 'admin' };
      let token = jwt.sign(user, process.env.SECRET, { expiresIn: 1000 * 60 * 24 });

      req.headers = {
        authorization: `Bearer ${token}`,
      };

      await bearer(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });


    test('Failed to login with wrong username', async () => {
      let response = await request.post('/signin').auth('wrongUser', 'abc');
      let { user, token } = response.body;

      expect(response.status).toBe(403);
      expect(response.text).toEqual('Invalid Login');
      expect(user).not.toBeDefined();
      expect(token).not.toBeDefined();
    });


    test('Failed to login with wrong password', async () => {
      let response = await request.post('/signin').auth('admin', 'abc');
      let { user, token } = response.body;

      expect(response.status).toBe(403);
      expect(response.text).toEqual('Invalid Login');
      expect(user).not.toBeDefined();
      expect(token).not.toBeDefined();
    });

  });

});
