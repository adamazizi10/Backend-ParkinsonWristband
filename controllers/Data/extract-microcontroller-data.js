import axios from 'axios';
import { JSDOM } from 'jsdom';

const handleExtractMicrocontrollerData = async (req, res, db) => {
    const id = req.params.id;
    //start detection or redetect button is clicked on the frontend. Now we get stuties data
    try {
        // Fetch data from microcontroller server
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
        //Send Stuti's data to Huzaifa's script here
        // Make a request to the Python API
        const pythonApiResponse = await axios.post('http://127.0.0.1:5000/double-data', data);

        // Get the result from the Python API
        const pythonData = pythonApiResponse.data;

        // Send the doubled data as a response
        

        // Store the received data in the "patient" database
        const { t, x, y, z, parkinson_status } = pythonData;
        // const x = [1,2,3,5,5,1,6,5,4,1]
        // const y = [1,6,3,1,2,3,1,3,1,2]
        // const z = [7,3,7,1,3,5,7,1,1,2]
        // const t = [1,2,3,4,5,6,7,8,9,10]
        // const parkinson_status = 'nice'

        db('patient')
            .where({ id })
            .update({ x, y, z, t, parkinson_status })
            .returning('id') // Return the required fields
                    .then(data => {
                        res.status(200).json(data[0]);
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).json({ error: "Internal server error." });
                    });
            

    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

export default { handleExtractMicrocontrollerData };
