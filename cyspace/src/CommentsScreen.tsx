import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect, MouseEvent, MouseEventHandler, useRef } from 'react';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

interface Article {
    id: number;
    title: string;
    url: string;
    image_url: string;
    news_site: string;
    summary: String;
    published_at: Date | undefined;
    updated_at: Date;
    launches: [];
    events: [];
}

function convertDateToString(dateObject: Date | undefined): string {
    if (typeof dateObject === "undefined") {
        dateObject = new Date();
    }
    const date = new Date(dateObject);
    const dateString: string = ('0' + date.getDate()).slice(-2) + "/" + ('0' + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
    return dateString;
}

async function getArticleById(id: number): Promise<Article> {
    const response = await fetch('http://localhost:3000/api/articles/' + id);
    console.log(response);
    const data = await response.json();
    return data;
}

function CommentsScreen() {
    const location = useLocation();
    const articleId = location.state.articleId;
    const [article, setArticle] = useState<Article>();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                console.log(articleId);
                const article = await getArticleById(Number(articleId));
                console.log(article);
                setArticle(article);
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
        <Card variant="outlined" sx={{ margin: 10 }}>
            <Button onClick={() => navigate('/')} size="small" sx={{ color: 'text.secondary', mb: 1.5, fontSize: 14, textAlign: 'left' }}>Back</Button>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, textAlign: 'left' }}>
                    <img src={article?.image_url} width={250} height={250}></img>
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 14, textAlign: 'right' }}>
                    {convertDateToString(article?.published_at)}
                </Typography>
                <Typography gutterBottom sx={{ fontSize: 20, textAlign: 'left' }}>
                    {article?.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 14, textAlign: 'left' }}>
                    {article?.news_site}/<a href={article?.url}>{article?.url}</a>
                </Typography>
            </CardContent>

        </Card>
    );
}

export default CommentsScreen;