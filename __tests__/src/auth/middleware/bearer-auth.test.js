'use strict';

process.env.SECRET = 'TEST_SECRET';

const bearer = require('../../../../src/auth/middleware/bearer.js');
const { db, users } = require('../../../../src/auth/models/index.js');
const jwt = require('jsonwebtoken');

let userInfo = {
  admin: { username: 'admin', password: 'password' },
};

// Pre-load our database with fake users
beforeAll(async () => {
  await db.sync();
  await users.create(userInfo.admin);
});
afterAll(async () => {
  await db.drop();
});


describe('Auth Middleware', () => {
  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  const next = jest.fn();


  describe('user authentication', () => {
    test('Fails a login for a user (admin) with an incorrect token', async () => {

      req.headers = {
        authorization: 'Bearer thisisabadtoken',
      };

      await bearer(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);

    });


    test('Successfully login for a user with a proper token', async () => {

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
