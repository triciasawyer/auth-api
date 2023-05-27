# Project: auth-api

## Author: Tricia Sawyer

## Problem Domain

Modularize the provided code into a single server instance

## Links and Resources

ChatGTP for help with tests

## Setup

### `.env` requirements

- `PORT` - Port Number
- `DATABASE_URL` - URL to the running Postgres instance/db
- `SECRET` - Secret for jwt tokens

### How to initialize/run your application (where applicable)

- Create repo
- Add starter code
- `npm install` to install dependencies.
- `npm run db:config` then edit the created config file.
- `npm run db:create` to create the database.
- `npm start` to start the application.

### Features / Routes

Certain routes within v2 and user options will require basic or bearer auth.
GET : /api/v2/food - get all food records
GET : /api/v2/food/:id - get a specific food record
POST : /api/v2/food - update a food record
PUT : /api/v2/food/:id updated a food record by id
PATCH : /api/v2/food/:id update a food record by id
DELETE : /api/v2/delete delete a food record

### UML

![auth-api UML](./lab8-UML.png)
