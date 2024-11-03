import express, { Request, Response } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { json } from 'body-parser';

const app = express();
const cors = require('cors');
const dotenv = require("dotenv");
const prisma = new PrismaClient();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const PORT = process.env.PORT || 3000;
const BASEURL = 'https://api.spaceflightnewsapi.net/v4/articles/';


function jsonConvert (param: any) : any {
  return JSON.stringify(
    param,
    (key, value) => (typeof value === "bigint" ? value.toString() : value));
}

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

app.post('/api/articles/search/date', jsonParser, async (req: Request, res: Response) => {
  console.log(req.body);
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  try {
    const response = await axios.get(`${BASEURL}`,
      {
        params: {
          published_at_gte: startDate,
          published_at_lte: endDate
        }
      });
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

app.post('/api/articles/comment/create', jsonParser, async (req: Request, res: Response) => {
  console.log(req.body.formData.articleId);
  console.log(req.body.formData.alias);
  console.log(req.body.formData.comment);
  const articleId = req.body.formData.articleId;
  const alias = req.body.formData.alias;
  const username = req.body.formData.alias.toLowerCase();
  const comment = req.body.formData.comment;
  try {
    const result = await prisma.comment.create({
      data: {
        articleId: articleId,
        username: username,
        alias: alias,
        comment: comment,
        date: new Date()
      }
    });
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

app.get('/api/articles/comment/retrieve/:articleId', async (req: Request, res: Response) => {
  const { articleId } = req.params;
  console.log(articleId);
  try {
    const comment = await prisma.comment.findMany({
      where: { articleId: Number(articleId) },
      orderBy: {
        date: 'desc'
      }
    });
    res.send(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching comment" });
  }
});

app.get('/api/articles/comment/retrieve/commenters/top', async (req: Request, res: Response) => {
  try {
    const comments = await prisma.$queryRaw`SELECT username, COUNT(username) as count FROM public.comment group by username order by count desc;`
    console.log(jsonConvert(comments));
    res.send(jsonConvert(comments));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching comment" });
  }
});

app.get('/api/articles/comment/retrieve/commenters/avg', async (req: Request, res: Response) => {
  try {
    const comments = await prisma.$queryRaw`select count(*) / count(distinct date(date)) as countPerDay from public.comment;`
    console.log(jsonConvert(comments));
    res.send(jsonConvert(comments));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching comment" });
  }
});

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:${PORT}');
});