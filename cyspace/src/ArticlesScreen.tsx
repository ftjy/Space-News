import { useNavigation } from '@react-navigation/native';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import React, { useState, useEffect, MouseEvent, MouseEventHandler } from 'react';

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
  
  function convertDateToString(dateObject: Date): string {
    const date = new Date(dateObject);
    const dateString: string = ('0' + date.getDate()).slice(-2) + "/" + ('0' + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
    return dateString;
  }

  
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
  
  const handleMouseEvent = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert("HELLO");
  };

  async function fetchArticles(): Promise<ArticleResponse> {
    const response = await fetch('http://localhost:3000/');
    console.log(response)
    const data = await response.json();
    return data;
  }
  
  
  async function getArticleById(id: number): Promise<ArticleResponse> {
    const response = await fetch('http://localhost:3000/api/articles/' + id);
      console.log(response);
      const data = await response.json();
      return data;
  }

function ArticlesScreen() {
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
                                            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, textAlign: 'left' }}>
                                                <img src={article.image_url} width={250} height={250}></img>
                                            </Typography>
                                            <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 14, textAlign: 'right' }}>
                                                {convertDateToString(article.published_at)}
                                            </Typography>
                                            <Typography gutterBottom sx={{ fontSize: 20, textAlign: 'left' }}>
                                                {article.title}
                                            </Typography>
                                            <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 14, textAlign: 'left' }}>
                                                {article.news_site} / <a href={article.url}>{article.url}</a>
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button onClick={() => getArticleById(article.id)} size="small" sx={{ color: 'text.secondary', mb: 1.5, fontSize: 14, textAlign: 'right' }}>Comments</Button>
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

export default ArticlesScreen;