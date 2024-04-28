import puppeteer from 'puppeteer';
import axios from 'axios';

let browser; // Declare browser instance outside the handler
let overlapDataFromPreviousFetch = { c: [], t: [], x: [], y: [], z: [] }; // Declare overlapData as a global variable


const handleExtractMicrocontrollerData = async (req, res, db) => {
    const id = req.params.id;
    const { action } = req.body;

    const pageUrl = 'http:/172.20.10.2/';

    try {
        if (action === 'Stop') {
            if (browser) {
                await browser.close(); // Close the Puppeteer page here
            }
        } else {
            if (!browser) {
                browser = await puppeteer.launch();
            }

            const page = await browser.newPage(); // Create a new page for each request
            await page.goto(pageUrl);
            await page.waitForSelector('#sensorDataTable'); // Wait for the sensor data table to be available
            await page.waitForSelector('#startBtn');

            const delay = 3 //seconds
            console.log(`Waiting ${delay} seconds for page to load`);
            await new Promise(resolve => setTimeout(resolve, delay * 1000)); //line a

            //200 rows = 5 seconds, 160 rows = 4 seconds, 120 rows = 3 seconds, 80 rows = 2 seconds, 40 rows = 1 seconds
            // await new Promise(resolve => setTimeout(resolve, 4000));  //line b
C
            // Inside the else block where you click on the start button
            await page.click('#startBtn');

            let rowCount = 0;
            const numberOfPoints = 50;
            while (rowCount < numberOfPoints) {
                await new Promise(resolve => setTimeout(resolve, 200)); // Wait for 200 milliseconds
                const currentRowCount = await page.evaluate(() => {
                    const table = document.getElementById('sensorDataTable');
                    return table.rows.length - 1; // Exclude header row
                });
                rowCount = currentRowCount;
            }

            //when 150 rows are generated, proceed to next line of code which clicks stop button
            await page.click('#stopBtn');
            //take total of line a + line b + 0.5 second in the frontend for delay of recieving of data

            //there will be overlap if for example you want 200 rows, instead of fetching every 5 seconds, you fetch every 2.5 seconds so it takes the rest from previous

            const aggregatedData = await page.evaluate(() => {
                const table = document.getElementById('sensorDataTable');
                // See Callibration
                const rows = Array.from(table.rows).slice(1); // Skip the header row
                const data = rows.map(row => {
                    const cells = row.cells;
                    return {
                        c: cells[0].textContent,
                        t: cells[1].textContent,
                        x: cells[2].textContent,
                        y: cells[3].textContent,
                        z: cells[4].textContent
                    };
                });

                let c = [];
                let t = [];
                let x = [];
                let y = [];
                let z = [];

                const numberOfPoints = 50;
                if (data.length >= numberOfPoints) {
                    for (let i = data.length - numberOfPoints; i < data.length; i++) {
                        c.push(data[i].c);
                        t.push(data[i].t);
                        x.push(data[i].x);
                        y.push(data[i].y);
                        z.push(data[i].z);
                    }
                }

                return {
                    c: c,
                    t: t,
                    x: x,
                    y: y,
                    z: z
                };
            });

            // const midpoint = Math.floor(aggregatedData.c.length / 2);
            

            const newDataToBeJoinedWithOverlap = {
                c: aggregatedData.c || [],
                t: aggregatedData.t || [],
                x: aggregatedData.x || [],
                y: aggregatedData.y || [],
                z: aggregatedData.z || [],
            };
            console.log(`newDataToBeJoinedWithOverlap.c: ${newDataToBeJoinedWithOverlap.c}`)

            const completeData = {
                c: overlapDataFromPreviousFetch.c.concat(newDataToBeJoinedWithOverlap.c),
                t: overlapDataFromPreviousFetch.t.concat(newDataToBeJoinedWithOverlap.t),
                x: overlapDataFromPreviousFetch.x.concat(newDataToBeJoinedWithOverlap.x),
                y: overlapDataFromPreviousFetch.y.concat(newDataToBeJoinedWithOverlap.y),
                z: overlapDataFromPreviousFetch.z.concat(newDataToBeJoinedWithOverlap.z),
            }
            console.log(`completeData.c: ${completeData.c}`)
            console.log(`completeData.c count is: ${completeData.c.length}`)
            //
            //Send data to huzaifa
            const pythonApiResponse = await axios.post('http://127.0.0.1:3002/double-data', completeData);
            const pythonData = pythonApiResponse.data; //recieve features and from huzaifa
            
            
            overlapDataFromPreviousFetch = {
                c: aggregatedData.c || [],
                t: aggregatedData.t || [],
                x: aggregatedData.x || [],
                y: aggregatedData.y || [],
                z: aggregatedData.z || [],
            };
            console.log(`overlapDataFromPreviousFetch: ${overlapDataFromPreviousFetch.c}`)

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
            const lastIndex = completeData.t.length - 6;
            const featureExtractedData = {
                first_name: 'testname',
                last_name: 'testlastname',
                t: completeData.t.slice(lastIndex),
                x: completeData.x.slice(lastIndex),
                y: completeData.y.slice(lastIndex),
                z: completeData.z.slice(lastIndex),
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

            // console.log(`Features: ${featureExtractedData}`)
            res.status(200).json(featureExtractedData);

        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export default { handleExtractMicrocontrollerData };


