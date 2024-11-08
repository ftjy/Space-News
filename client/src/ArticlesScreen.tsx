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
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import useFetch from "./Hooks/useFetch";
import Loader from "./Components/Loader";


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
    id: number;
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
    const [articles, setArticles] = useState<Article[]>([])
    const [errorFetchData, setErrorFetchData] = useState<string | null>(null);
    const [searchString, setSearchString] = useState<String>();
    const [startDate, setStartDate] = useState<Dayjs>();
    const [endDate, setEndDate] = useState<Dayjs>();
    const [maxEndDate, setMaxEndDate] = useState<Dayjs>();
    const [minStartDate, setMinStartDate] = useState<Dayjs>();
    const [startDateErrorMsg, setStartDateErrorMsg] = React.useState<DateValidationError | null>(null);
    const [endDateErrorMsg, setEndDateErrorMsg] = React.useState<DateValidationError | null>(null);
    const [avgCommentsPerDay, setAvgCommentsPerDay] = useState<number>();
    const [topCommenters, setTopCommenters] = useState<topCommenters[]>();
    const [fetchArticleResponse, { articleData, loadingData, errorData }] = useFetch<ArticleResponse>();
    const articleResponseRef = useRef<ArticleResponse>();
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
        setArticles(searchResults.results)
    }

    async function searchByDate() {
        if (dayjs(startDate).isValid() && dayjs(endDate).isValid()) {
            const startDateIso = startDate?.toISOString()
            const endDateIso = endDate?.toISOString()
            const searchResults = await searchArticlesByDate(startDateIso!, endDateIso!);
            console.log(searchResults);
            setArticleResponse(searchResults);
            setArticles(searchResults.results);
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
            const articleResponseData = await getArticles();
            const topComments = await getTopComments();
            const avgComments = await getAvgComments();
            console.log(articleResponseData);
            console.log(topComments);
            console.log(avgComments);
            setArticleResponse(articleResponseData);
            setTopCommenters(topComments);
            setAvgCommentsPerDay(avgComments[0].countperday);
            setArticles(articleResponseData.results)
        } catch (errorFetchData) {
            console.error(errorFetchData);
        }
    }

    const handleScroll = useCallback(async () => {
        if (
          window.innerHeight + window.scrollY >= document.body.scrollHeight - 1 && !loadingData
        ) {
            console.log(articleResponseRef.current);
            if (typeof articleResponseRef.current !== "undefined"){
                await fetchArticleResponse(articleResponseRef.current.next);
            }
        }
      }, []);

    
    useEffect(() => {
        articleResponseRef.current = articleResponse;
    }, [articleResponse]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loadingData]);

    useEffect(() => {
        fetchData();
    }, []);
    
    useEffect(() => {
        console.log("Enter useEffect4")
        if (!loadingData && articleData && articleData?.count > 0) {
            setArticles((prevArticles) => [...prevArticles, ...articleData.results]);
            setArticleResponse(articleData);
        }
        }, [articleData, loadingData]);

    if (errorFetchData) {
        return <div>Error: {errorFetchData}</div>;
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <h1>Space News</h1>
                    </Col>
                </Row>
            </Container>
            <br/>
            <Container>
                <Row>
                    <Col>
                        <Item>
                            <Row>
                                <Col>  
                                    <h3>Top 3 commenters</h3>
                                </Col>
                            </Row>
                            {topCommenters?.map((topComment) => (
                            <Row key={topComment.id}>
                                <Col>
                                    {topComment.username}
                                </Col>
                                <Col>
                                    {topComment.count} Comments
                                </Col>
                            </Row>
                            ))}
                        </Item>
                    </Col>
                    <Col>
                        <Item>
                            <Row>
                                <Col>
                                    <h3>Average Comments/Day</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {avgCommentsPerDay} comments
                                </Col>
                            </Row>
                        </Item>
                    </Col>
                </Row>
            </Container>
            <br/>
            <Container>
                <Row>
                    <Col>
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
                    </Col>
                    <Col className="search-button-right">
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
                                <div className="datepicker-split-empty-space"></div>
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
                        <div className="search-button-right">
                            <Button className="search-button" onClick={() => searchByDate()}>Search By Date</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col>
                        <Box sx={{ flexGrow: 2 }}>
                            <Grid
                                container
                                spacing={12}
                                alignItems="center"
                                justifyContent="center"
                                direction="column">
                                {articles.map((article) => (
                                    <Grid key={article.id} size={{ md: 12 }}>
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
                                                    <div className="align-items-right">
                                                        <Button onClick={() => navigate('/article', { state: { articleId: article.id } })} size="small" sx={{ color: 'text.secondary', mb: 1.5, fontSize: 14, textAlign: 'right' }}><CommentIcon /></Button>
                                                    </div>
                                                </CardActions>
                                            </Card>
                                        </Item>
                                    </Grid>
                                ))}
                                {loadingData && (
                                    <>
                                    <Loader />
                                    <Loader />
                                    </>
                                )}
                                {errorData && <div>Error: {errorData}</div>}
                            </Grid>
                        </Box>
                    </Col>
                </Row>
            </Container>
        </div>
    );

}

export default ArticlesScreen;