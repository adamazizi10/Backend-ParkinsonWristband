import puppeteer from 'puppeteer';
import axios from 'axios';

let browser; // Declare browser instance outside the handler

const handleExtractMicrocontrollerData = async (req, res, db) => {
    const id = req.params.id;
    const { action } = req.body;

    const pageUrl = 'http://10.0.0.157/';

    try {
        if (action === 'Stop') {
            if (browser) {
                await browser.close(); // Close the Puppeteer page
            }
        } else {
            if (!browser) {
                browser = await puppeteer.launch();
            }

            const page = await browser.newPage(); // Create a new page for each request
            await page.goto(pageUrl);
            await page.click('#startBtn');
            await new Promise(resolve => setTimeout(resolve, 2000));

            const aggregatedData = await page.evaluate(() => {
                const table = document.getElementById('sensorDataTable');
                // See Callibration
                const rows = Array.from(table.rows).slice(1); // Skip the header row
                const data = rows.map(row => {
                    const cells = row.cells;
                    return {
                        t: cells[0].textContent,
                        x: cells[1].textContent,
                        y: cells[2].textContent,
                        z: cells[3].textContent
                    };
                });

                // Trim data to only keep the last 5 entries
                return {
                    t: data.slice(-5).map(entry => entry.t),
                    x: data.slice(-5).map(entry => entry.x),
                    y: data.slice(-5).map(entry => entry.y),
                    z: data.slice(-5).map(entry => entry.z)
                };
            });

            console.log(aggregatedData);

            const completeData = {
                t: aggregatedData.t,
                x: aggregatedData.x,
                y: aggregatedData.y,
                z: aggregatedData.z,
            };



            //Send data to huzaifa
            const pythonApiResponse = await axios.post('http://127.0.0.1:3002/double-data', completeData);
            const pythonData = pythonApiResponse.data; //recieve features and from huzaifa

            await page.close(); // Close the page after each request

            //Save into database
            const { t, x, y, z } = completeData
            const parkinson_status = pythonData.label
            const { x_mean, y_mean, z_mean, x_std, y_std, z_std } = pythonData;


            // const databaseData = await db('patient')
            //     .where({ id })
            //     // .update({ x, y, z, t, parkinson_status })
            //     .update({ x, y, z, t, parkinson_status, x_mean, y_mean, z_mean, x_std, y_std, z_std })
            //     .returning('*');

            function getRandomNumber() {
                return Math.floor(Math.random() * 10) + 1;
            }

            const featureExtractedData = {
                first_name: 'testname',
                last_name: 'testlastname',
                t: completeData.t,
                x: completeData.x,
                y: completeData.y,
                z: completeData.z,
                parkinson_status: pythonData.label,
                x_mean: pythonData.x_mean,
                y_mean: pythonData.y_mean,
                z_mean: pythonData.z_mean,
                x_std: pythonData.x_std,
                y_std: pythonData.y_std,
                z_std: pythonData.z_std,
            };

            // const featureExtractedData = {
            //     first_name: databaseData[0].first_name,
            //     last_name: databaseData[0].last_name,
            //     t: databaseData[0].t,
            //     x: databaseData[0].x,
            //     y: databaseData[0].y,
            //     z: databaseData[0].z,
            //     parkinson_status: databaseData[0].parkinson_status,
            //     x_mean: databaseData[0].x_mean,
            //     y_mean: databaseData[0].y_mean,
            //     z_mean: databaseData[0].z_mean,
            //     x_std: databaseData[0].x_std,
            //     y_std: databaseData[0].y_std,
            //     z_std: databaseData[0].z_std,
            // };
            
            console.log(`Features: ${featureExtractedData}`)
            res.status(200).json(featureExtractedData);

        }
        

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export default { handleExtractMicrocontrollerData };





/*

 if (action === 'Stop') {
            if (browser) {
                await browser.close(); // Close the Puppeteer page
            }
        } else {

*/