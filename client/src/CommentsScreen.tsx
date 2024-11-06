import './CommentsScreen.css';
import { Box, Input, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';


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

interface commentState {
    articleId: string
    alias: string
    comment: string
}

interface Comment {
    id: number;
    articleId: number;
    username: String;
    alias: String;
    comment: String;
    date: Date;
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

function convertDateToString(dateObject: Date | undefined): string {
    if (typeof dateObject === "undefined") {
        dateObject = new Date();
    }
    const date = new Date(dateObject);
    const dateString: string = ('0' + date.getDate()).slice(-2) + "/" + ('0' + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
    return dateString;
}

function CommentsScreen() {
    const location = useLocation();
    const articleId = location.state.articleId;
    const [article, setArticle] = useState<Article>();
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<commentState>({
        articleId: articleId,
        alias: '',
        comment: ''
    })

    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }))
    }

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/articles/comment/create', {
                headers: { 'Content-type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({ formData })
            })
                .then(async () => {
                    setComments(await getCommentsByArticleId(articleId));
                })
                .then(() => onCancel());
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    function onCancel() {
        setFormData({
            articleId: articleId,
            alias: '',
            comment: ''
        })
    };

    async function getArticleById(id: number): Promise<Article> {
        const response = await fetch('http://localhost:3000/api/articles/' + id);
        console.log(response);
        const data = await response.json();
        return data;
    }

    async function getCommentsByArticleId(id: number): Promise<Comment[]> {
        const response = await fetch('http://localhost:3000/api/articles/comment/retrieve/' + id);
        console.log(response);
        const data = await response.json();
        return data;
    }

    async function fetchData() {
        try {
            console.log(articleId);
            const article = await getArticleById(Number(articleId));
            const comments = await getCommentsByArticleId(Number(articleId));
            console.log(article);
            setArticle(article);
            setComments(comments);
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
            <br/>
            <Container>
                <Row>
                    <Col>
                        <Button className="align-items-right" onClick={() => navigate('/')}>&lt; Back</Button>
                        <Container>
                            <Row>
                                <Col>
                                    <Box sx={{ flexGrow: 2 }}>
                                        <Grid container 
                                            spacing={12}
                                            alignItems="center"
                                            justifyContent="center"
                                            direction="column"
                                            size={{ md: 12 }}>
                                            <img className="img-comment" src={article?.image_url}></img>
                                        </Grid>
                                    </Box>
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
                                                <h3>{article?.title}</h3>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                {article?.news_site}/<a href={article?.url}>{article?.url}</a>
                                            </Col>
                                        </Row>
                                    </Item>
                                </Col>
                            </Row>
                        </Container>                        
                    </Col>
                </Row>
            </Container>
            <br/>
            <Container>
                <Row>
                    <Col>
                        <h3>{comments?.length} Comments</h3>
                    </Col>
                </Row>
            </Container>
            <br/>
            <Container>
                <Row>
                    <Col>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="alias"> Username: </label>
                                <br />
                                <input placeholder="e.g. john.smith" type="text" name="alias" id="alias" onChange={handleChange} value={formData.alias} required maxLength={66}></input>
                                <br />
                            </div>
                            <div>
                                <label htmlFor="comment"> Comment: </label>
                                <br />
                                <textarea placeholder="Write a comment..." className="input-text-comment" name="comment" id="comment" onChange={handleChange} value={formData.comment} required maxLength={4000}></textarea>
                                <br />
                            </div>
                            <div className="align-right-button">
                                <Button value="cancel" onClick={onCancel} type="reset" size="small" sx={{ color: 'text.secondary', mb: 1.5, fontSize: 14, textAlign: 'right' }}>Cancel</Button>
                                <Button value="publish" type="submit" size="small" sx={{ color: 'text.secondary', mb: 1.5, fontSize: 14, textAlign: 'right' }}>Publish</Button>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Container>
            <br/>
            <Container>
                <Row>
                    <Col>
                    {comments?.map((comment) => (
                        <Row key={comment.id}>
                            <Row>
                                <Col>
                                    <h3>{comment.alias}</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {convertDateToString(comment.date)}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {comment.comment}
                                </Col>
                            </Row>
                            <br/>
                            <br/>
                        </Row>))}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default CommentsScreen;