import { useParams } from 'react-router-dom';
import React, { useState, useEffect, MouseEvent, MouseEventHandler, useRef } from 'react';

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

async function getArticleById(id: number): Promise<Article> {
    const response = await fetch('http://localhost:3000/api/articles/' + id);
    console.log(response);
    const data = await response.json();
    return data;
}

function CommentsScreen() {
    const {articleId} = useParams();
    const [article, setArticle] = useState<Article>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
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

    return(
        <div>{articleId}</div>
    );
}

export default CommentsScreen;