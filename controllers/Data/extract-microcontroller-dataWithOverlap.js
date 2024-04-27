import puppeteer from 'puppeteer';
import axios from 'axios';

let browser; // Declare browser instance outside the handler

const handleExtractMicrocontrollerData = async (req, res, db) => {
    const id = req.params.id;
    const { action, overlapData_x, overlapData_y, overlapData_z, overlapData_t } = req.body;
    console.log(`overlap x: ${overlapData_x}`)
    console.log(`overlap y: ${overlapData_y}`)
    console.log(`overlap z: ${overlapData_z}`)
    console.log(`overlap t: ${overlapData_t}`)
    const pageUrl = 'http://10.0.0.157/';

    try {
        if (action === 'Stop') {
            if (browser) {
                await browser.close(); // Close the Puppeteer page
                browser = null;
            }
        } else {
            if (!browser) {
                browser = await puppeteer.launch();
            }

            const page = await browser.newPage(); // Create a new page for each request
            await page.goto(pageUrl);
            await page.waitForSelector('#sensorDataTable'); // Wait for the sensor data table to be available
            await page.waitForSelector('#startBtn');

            console.log('Waiting 3 seconds for page to load');
            await new Promise(resolve => setTimeout(resolve, 2000)); //line a

            await page.click('#startBtn');

            //200 rows = 5 seconds, 160 rows = 4 seconds, 120 rows = 3 seconds, 80 rows = 2 seconds, 40 rows = 1 seconds
            await new Promise(resolve => setTimeout(resolve, 4000));  //line b
            //take total of line a + line b + 1 second in the frontend for delay of recieving of data

            const aggregatedData = await page.evaluate(() => {
                console.log('aggregated Data')

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

            

            const overlapDataFromPreviousFetch = {
                t: overlapData_t ? overlapData_t.slice(-Math.ceil(overlapData_t.length / 2)) : [],
                x: overlapData_x ? overlapData_x.slice(-Math.ceil(overlapData_x.length / 2)) : [],
                y: overlapData_y ? overlapData_y.slice(-Math.ceil(overlapData_y.length / 2)) : [],
                z: overlapData_z ? overlapData_z.slice(-Math.ceil(overlapData_z.length / 2)) : []
            };
            
            const newDataFromWristband = {
                t: aggregatedData.t,
                x: aggregatedData.x,
                y: aggregatedData.y,
                z: aggregatedData.z,
            };

            const completeData = {
                t: overlapDataFromPreviousFetch.t.concat(newDataFromWristband.t),
                x: overlapDataFromPreviousFetch.x.concat(newDataFromWristband.x),
                y: overlapDataFromPreviousFetch.y.concat(newDataFromWristband.y),
                z: overlapDataFromPreviousFetch.z.concat(newDataFromWristband.z)
            };
            
            console.log(completeData);
            



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