import express, { Request, Response } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const app = express();
const cors = require('cors');
const dotenv = require("dotenv");
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const BASEURL = 'https://api.spaceflightnewsapi.net/v4/articles/';

app.use(cors());

dotenv.config();

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
  console.log(titleText)
  try {
    const response = await axios.get(`${BASEURL}`,
      {
        params: {
          title_contains: titleText
        }
      });
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

app.post('/api/articles/comment/create', async (req: Request, res: Response) => {
  try {
    await prisma.comment.create({
      data: {
        username: "Alan",
        alias: "aLan",
        comment: "Hello I am here!",
        date: new Date()
      }
    });
    res.send("Success!");
  } catch (error) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

app.get('/api/articles/comment/retrieve/:username', async (req: Request, res: Response) => {
  const username = req.query;
  try {
    const comment = await prisma.comment.findMany({
      where: username
    });
    if (comment) {
      res.send(comment);
      // res.status(200).json(comment);
    } else {
      // res.status(404).json({ message: "Comment not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching comment" });
  }
});

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:${PORT}');
});