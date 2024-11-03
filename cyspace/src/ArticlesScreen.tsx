import './ArticlesScreen.css';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CommentIcon from '@mui/icons-material/Comment';
import dayjs, { Dayjs } from 'dayjs';
import { DateValidationError } from '@mui/x-date-pickers/models';


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

interface topCommenters {
    username: string;
    count: number;
}

interface avgComments {
    countperday: number;
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

function ArticlesScreen() {
    const [articleResponse, setArticleResponse] = useState<ArticleResponse>();
    const [error, setError] = useState<string | null>(null);
    const [searchString, setSearchString] = useState<String>();
    const [startDate, setStartDate] = useState<Dayjs>();
    const [endDate, setEndDate] = useState<Dayjs>();
    const [maxEndDate, setMaxEndDate] = useState<Dayjs>();
    const [minStartDate, setMinStartDate] = useState<Dayjs>();
    const [startDateErrorMsg, setStartDateErrorMsg] = React.useState<DateValidationError | null>(null);
    const [endDateErrorMsg, setEndDateErrorMsg] = React.useState<DateValidationError | null>(null);
    const [avgCommentsPerDay, setAvgCommentsPerDay] = useState<number>();
    const [topCommenters, setTopCommenters] = useState<topCommenters[]>();
    const navigate = useNavigate();

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        console.log(event.key);
        if (event.key == "Enter") {
            console.log(searchString);
            search(searchString!);
        }
    }

    async function search(text: String) {
        console.log(text);
        const searchResults = await searchArticles(text);
        console.log(searchResults);
        setArticleResponse(searchResults);
    }

    async function searchByDate() {
        if (dayjs(startDate).isValid() && dayjs(endDate).isValid()) {
            const startDateIso = startDate?.toISOString()
            const endDateIso = endDate?.toISOString()
            const searchResults = await searchArticlesByDate(startDateIso!, endDateIso!);
            console.log(searchResults);
            setArticleResponse(searchResults);
        } else if (dayjs(startDate).isValid()) {
            // error message for beforeDate
        } else if (dayjs(endDate).isValid()) {
            // error message for afterDate
        }
    }

    async function getArticles(): Promise<ArticleResponse> {
        const response = await fetch('http://localhost:3000/');
        console.log(response)
        const data = await response.json();
        return data;
    }

    async function searchArticles(titleText: String): Promise<ArticleResponse> {
        const response = await fetch('http://localhost:3000/api/articles/search/' + titleText);
        console.log(response);
        const data = await response.json();
        return data;
    }

    async function searchArticlesByDate(dateBefore: String, dateAfter: String): Promise<ArticleResponse> {
        const response = await fetch('http://localhost:3000/api/articles/search/date/', {
            headers: { 'Content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ startDate: dateBefore, endDate: dateAfter })
        });
        console.log(response);
        const data = await response.json();
        return data;
    }

    async function getTopComments(): Promise<topCommenters[]> {
        const response = await fetch('http://localhost:3000/api/articles/comment/retrieve/commenters/top');
        console.log(response);
        const data = await response.json();
        return data;
    }

    async function getAvgComments(): Promise<avgComments[]> {
        const response = await fetch('http://localhost:3000/api/articles/comment/retrieve/commenters/avg');
        console.log(response);
        const data = await response.json();
        return data;
    }

    

    async function fetchData() {
        try {
            const articles = await getArticles();
            const topComments = await getTopComments();
            const avgComments = await getAvgComments();
            console.log(articles);
            console.log(topComments);
            console.log(avgComments);
            setArticleResponse(articles);
            setTopCommenters(topComments);
            setAvgCommentsPerDay(avgComments[0].countperday);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <div>
                <Box sx={{ flexGrow: 2 }}>
                    <Card variant="outlined" sx={{ margin: 10 }}>
                    <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 14, textAlign: 'right' }}>
                        Top 3 commenters
                    </Typography>
                    {topCommenters?.map((topComment) => (
                        <CardContent>
                            <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 14, textAlign: 'right' }}>
                                {topComment.username}
                            </Typography>
                            <Typography gutterBottom sx={{ fontSize: 20, textAlign: 'left' }}>
                                {topComment.count} Comments
                            </Typography>
                        </CardContent>
                    ))}
                    </Card>
            </Box>
            </div>
            <div>
                <Box sx={{ flexGrow: 2 }}>
                    <Card variant="outlined" sx={{ margin: 10 }}>
                        <CardContent>
                            <Typography sx={{ color: 'text.secondary', mb: 1.5, fontSize: 14, textAlign: 'right' }}>
                                Average Comments/Day
                            </Typography>
                            <Typography gutterBottom sx={{ fontSize: 20, textAlign: 'left' }}>
                                {avgCommentsPerDay} comments
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </div>
            <div>
                <TextField
                    onKeyDown={handleKeyDown}
                    onChange={(e) => { setSearchString(e.target.value); }}
                    type="search"
                    placeholder="Search"
                    InputProps={{
                        style: {
                            fontSize: 12,
                            width: 200,
                            height: 40
                        },
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                        <DatePicker label="Start Date"
                            // defaultValue={dayjs().add(-14, 'day')}
                            slotProps={{ textField: { size: 'small' } }}
                            value={startDate ?? null}
                            format="DD/MM/YYYY"
                            maxDate={maxEndDate}
                            onChange={(value) => {
                                setStartDate(value!);
                                setMinStartDate(value!);
                            }}
                            // onError={(endDateErrorMsg) => setEndDateErrorMsg(endDateErrorMsg)}
                            // slotProps={{
                            //     textField: {
                            //       helperText: endDateErrorMsg,
                            //     },
                            //   }}
                            disableFuture
                        />
                        <DatePicker label="End Date"
                            // defaultValue={dayjs().add(-7, 'day')}
                            slotProps={{ textField: { size: 'small' } }}
                            value={endDate ?? null}
                            minDate={minStartDate}
                            format="DD/MM/YYYY"
                            onChange={(value) => {
                                setEndDate(value!);
                                setMaxEndDate(value!);
                            }}
                            // onError={(endDateErrorMsg) => setEndDateErrorMsg(endDateErrorMsg)}
                            // slotProps={{
                            //     textField: {
                            //       helperText: endDateErrorMsg,
                            //     },
                            //   }}
                            disableFuture
                        />
                    </DemoContainer>
                </LocalizationProvider>
                <Button onClick={() => searchByDate()} size="small" sx={{ color: 'text.secondary', mb: 1.5, fontSize: 12, textAlign: 'right' }}>Search By Date</Button>
            </div>

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
                                            {article.news_site}/<a href={article.url}>{article.url}</a>
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={() => navigate('/article', { state: { articleId: article.id } })} size="small" sx={{ color: 'text.secondary', mb: 1.5, fontSize: 14, textAlign: 'right' }}><CommentIcon /></Button>
                                    </CardActions>
                                </Card>
                            </Item>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    );

}

export default ArticlesScreen;