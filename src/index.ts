import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;
const BASEURL = 'https://api.spaceflightnewsapi.net/v4/articles/';

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/api/articles', async (req: Request, res: Response) => {
    try {
      const response = await axios.get('${BASEURL}');
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error occurred' });
    }
  });

app.get('/api/articles/:id', async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const response = await axios.get(`${BASEURL}${id}`);
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error occurred' });
    }
});

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:${PORT}');
});