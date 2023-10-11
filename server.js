import express from 'express';
import cors from 'cors';
import knex from 'knex';
import register from './controllers/register.js';

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'adamazizi',
    database: 'capstone',
  }
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.post('/register', (req, res) => register.handleRegister(req, res, db));
app.listen(3001, () => console.log('App is running on port 3001'));
