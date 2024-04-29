import express from 'express';
import cors from 'cors';
import knex from 'knex';
import addPatient from './controllers/Patient/add-patient.js';
import getSpecificPatientDetails from './controllers/Patient/get-specific-patient-details.js';
import extractMicrocontrollerData from './controllers/Data/extract-microcontroller-data.js';
import getAllPatientData from './controllers/Patient/get-all-patient-data.js';
import registerDoctor from './controllers/Doctor/register-doctor.js'
import signinDoctor from './controllers/Doctor/signin-doctor.js';
import getAllDoctorData from './controllers/Doctor/get-all-doctor-data.js';
import storeLastSetOfData from './controllers/Data/store-last-set-of-data.js';
import dotenv from 'dotenv';
dotenv.config();



//dev
// const db = knex({ 
//   client: 'pg',
//   connection: {
//     host: '127.0.0.1',
//     port: 5432,
//     user: 'adamazizi',
//     database: 'capstone',
//   }
// });

//live
const db = knex({
  client: 'pg',
     connection: {
       connectionString : process.env.DATABASE_URL,
       ssl: {
        rejectUnauthorized: false, 
      },
     }
   });


const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
//Patient
app.post('/add-patient', (req, res) => addPatient.handleAddPatient(req, res, db));
app.get('/get-specific-patient-details/:id', (req, res) => getSpecificPatientDetails.handleGetSpecificPatientDetails(req, res, db)); //Get Specific Patient's Data
app.get('/get-all-patient-data', (req, res) => getAllPatientData.handleAllPatientData(req, res, db)); //Search Page

//Doctor
app.post('/registerDoctor', (req, res) => registerDoctor.handleDoctorRegistration(req, res, db));
app.post('/signinDoctor', (req, res) => signinDoctor.handleDoctorSignIn(req, res, db));
app.get('/get-all-doctor-data', (req, res) => getAllDoctorData.handleAllDoctorData(req, res, db)); 

//Data
app.get('/extract-microcontroller-data/:id', async (req, res) => extractMicrocontrollerData.handleExtractMicrocontrollerData(req, res, db));
app.post('/store-last-set-of-data/:id', async (req, res) => storeLastSetOfData.handleStoreLastSetOfData(req, res, db));

const port = 3009
app.get('/', (req, res) => res.send(`<h1>Parkinson Backend Server is running on port ${port}</h1>`));
app.listen(port, () => console.log(`Parkinson Backend Server is running on port ${port}`));
