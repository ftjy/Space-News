import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const BASEURL = 'https://api.spaceflightnewsapi.net/v4/articles/';

app.use(cors());

app.get('/', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${BASEURL}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

app.get('/api/articles/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${BASEURL}${id}`);
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

app.get('/api/articles/search/:titleText', async (req: Request, res: Response) => {
  const { titleText } = req.params;
  console.log(titleText);
  try {
    const response = await axios.get(`${BASEURL}`,
      {
        params: {
          title_contains: {titleText}
        }
      });
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:${PORT}');
});