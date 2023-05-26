'use strict';

process.env.SECRET = 'TEST_SECRET';

const bearer = require('../../../../src/auth/middleware/bearer.js');
const { db, users } = require('../../../../src/auth/models/index.js');
const jwt = require('jsonwebtoken');

let userInfo = {
  admin: { username: 'admin', password: 'password' },
};

beforeAll(async () => {
  await db.sync();
  await users.create(userInfo.admin);
});

afterAll(async () => {
  await db.drop();
});


describe('Auth Middleware', () => {
  const req = {};
  const res = {
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


    test('Successfully login with a proper token', async () => {
      const user = { username: 'admin' };
      const token = jwt.sign(user, process.env.SECRET, { expiresIn: 1000 * 60 * 24 });

      req.headers = {
        authorization: `Bearer ${token}`,
      };

      await bearer(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

  });
  
});
