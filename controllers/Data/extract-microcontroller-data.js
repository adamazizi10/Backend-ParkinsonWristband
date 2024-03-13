import puppeteer from 'puppeteer';

let browser; // Declare browser instance outside the handler

const handleExtractMicrocontrollerData = async (req, res) => {
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
                    t: data.slice(-20).map(entry => entry.t),
                    x: data.slice(-20).map(entry => entry.x),
                    y: data.slice(-20).map(entry => entry.y),
                    z: data.slice(-20).map(entry => entry.z)
                };
            });

            console.log(aggregatedData);

            const completeData = {
                t: aggregatedData.t,
                x: aggregatedData.x,
                y: aggregatedData.y,
                z: aggregatedData.z,
                parkinson_status: 'abdullah'
            };

            await page.close(); // Close the page after each request

            res.status(200).json(completeData);
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