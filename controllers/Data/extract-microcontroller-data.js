import axios from 'axios';
import { JSDOM } from 'jsdom';
const handleExtractMicrocontrollerData = async (req, res, db) => {
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
}
export default { handleExtractMicrocontrollerData };