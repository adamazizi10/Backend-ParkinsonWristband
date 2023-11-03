import express from 'express';
import cors from 'cors';
import knex from 'knex';
import axios from 'axios';
import { JSDOM } from 'jsdom';
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
// Define an API endpoint to fetch and parse the HTML content
app.get('/extract-data', async (req, res) => {
  try {
    const response = await axios.get('http://127.0.0.1:8080/');
    const html = response.data;

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const data = { t: [], x: [], y: [], z: [] };

    const tableRows = document.querySelectorAll('table tbody tr');
    tableRows.forEach((row) => {
      const columns = row.querySelectorAll('td');
      data.t.push(parseFloat(columns[0].textContent));
      data.x.push(parseFloat(columns[1].textContent));
      data.y.push(parseFloat(columns[2].textContent));
      data.z.push(parseFloat(columns[3].textContent));
    });

    res.json(data);
    console.log(data);
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
app.get('/get-patient-data', (req, res) => {
  db('patient')
    .select('id','first_name', 'last_name', 'age', 'parkinson_status')
    .then(patients => {
      res.json(patients);
    })
    .catch(error => {
      console.error('Error fetching patient data:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});
app.post('/register', (req, res) => register.handleRegister(req, res, db));
app.get('/get-patient-details/:id', (req, res) => {
  const patientId = req.params.id; // Get the patient ID from the URL parameter

  // Query your database to retrieve patient details based on patientId
  db('patient')
    .select( 'first_name', 'last_name', 'age', 'parkinson_status', /* other patient details */)
    .where('id', patientId) // Assuming your patient table has an 'id' column
    .then((patientDetails) => {
      if (patientDetails.length === 0) {
        res.status(404).json({ error: 'Patient not found' });
      } else {
        res.json(patientDetails[0]); // Assuming you expect only one patient with the given ID
      }
    })
    .catch((error) => {
      console.error('Error fetching patient details:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

app.listen(3001, () => console.log('App is running on port 3001'));
