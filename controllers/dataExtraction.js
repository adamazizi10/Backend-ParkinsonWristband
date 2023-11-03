import axios from 'axios';
import { JSDOM } from 'jsdom';

const handleDataExtraction = async (req, res) => {
  try {
    const response = await axios.get('http://127.0.0.1:8080/');
    const html = response.data;

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const data = { time: [], x: [], y: [], temp: [] };

    const tableRows = document.querySelectorAll('table tbody tr');
    tableRows.forEach((row) => {
      const columns = row.querySelectorAll('td');
      data.time.push(columns[0].textContent);
      data.x.push(columns[1].textContent);
      data.y.push(columns[2].textContent);
      data.temp.push(columns[3].textContent);
    });
    res.json(data);
    console.log(data);
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }

}
export default { handleDataExtraction };
