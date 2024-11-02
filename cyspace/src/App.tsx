import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';

interface ArticleResponse {
  count: number;
  next: string;
  previous: string;
  results: Article[];
}

interface Article {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: String;
  published_at: Date;
  updated_at: Date;
  launches: [];
  events: [];
}

async function fetchArticles(): Promise<ArticleResponse> {
  const response = await fetch('http://localhost:3000/');
  console.log(response)
  const data = await response.json();
  return data;
}


// async function getArticleById = () => {
//   axios.get('http://localhost:3000/api/articles/:id').then((response) => {
//     console.log(response.data);
//     return response.data;
//   });
// }

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));


function App() {
  const [articleResponse, setArticleResponse] = useState<ArticleResponse>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const articles = await fetchArticles();
        console.log(articles);
        setArticleResponse(articles);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="title-container">
      <div>
        <Box sx={{ flexGrow: 2 }}>
          <Grid
            container
            spacing={12}
            alignItems="center"
            justifyContent="center"
            direction="column">
            {articleResponse?.results?.map((article) => (
              <Grid key={article.id} size={{ xs: 8, md: 8 }}>
                <Item>
                  <Card variant="outlined" sx={{ margin: 10 }}>
                    <CardContent>
                      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {article.title}
                      </Typography>
                      <Typography variant="h5" component="div">
                        {article.summary}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
                      <Typography variant="body2">
                        <a href={article.url}>{article.url}</a>
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Learn More</Button>
                    </CardActions>
                  </Card>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </div>
  );
}


export default App;