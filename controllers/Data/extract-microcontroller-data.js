import puppeteer from 'puppeteer';
import axios from 'axios';

let browser; // Declare browser instance outside the handler
let overlapDataFromPreviousFetch = { c: [], t: [], x: [], y: [], z: [] }; // Declare overlapData as a global variable


const handleExtractMicrocontrollerData = async (req, res, db) => {
    const id = req.params.id;
    const { action } = req.body;


    try {

        const delay = 2.5 //seconds
        console.log(`Waiting ${delay} seconds for page to load`);
        await new Promise(resolve => setTimeout(resolve, delay * 1000)); //line a

        const generateRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
        const generateRandomDecimal = (min, max) => (Math.random() * (max - min)) + min
        const getRandomNumber1to4 = () => Math.floor(Math.random() * 4)

        const completeData = {
            c: Array.from({ length: 5 }, () => generateRandomInteger(1, 20)),
            t: Array.from({ length: 5 }, () => generateRandomInteger(1, 20)),
            x: Array.from({ length: 5 }, () => generateRandomDecimal(-3, 3)),
            y: Array.from({ length: 5 }, () => generateRandomDecimal(-5, 5)),
            z: Array.from({ length: 5 }, () => generateRandomDecimal(8, 10)),
            x_mean: generateRandomDecimal(-1, 1),
            y_mean: generateRandomDecimal(-1, 2),
            z_mean: generateRandomDecimal(8, 10),
            x_std: generateRandomDecimal(1, 2),
            y_std: generateRandomDecimal(1, 3),
            z_std: generateRandomDecimal(0.2, 0.8),
            parkinson_status: getRandomNumber1to4(),
        };
          
        const lastIndex = completeData.t.length - 6;
        const featureExtractedData = {
            first_name: 'testname',
            last_name: 'testlastname',
            t: completeData.t,
            x: completeData.x,
            y: completeData.y,
            z: completeData.z,
            parkinson_status: completeData.parkinson_status,
            x_mean: completeData.x_mean,
            y_mean: completeData.y_mean,
            z_mean: completeData.z_mean,
            x_std: completeData.x_std,
            y_std: completeData.y_std,
            z_std: completeData.z_std,
        };

        res.status(200).json(featureExtractedData);


    } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
}
};

export default { handleExtractMicrocontrollerData };


