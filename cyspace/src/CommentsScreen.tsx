import { useNavigation } from '@react-navigation/native';

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

async function getArticleById(id: number): Promise<ArticleResponse> {
    const response = await fetch('http://localhost:3000/api/articles/' + id);
    console.log(response);
    const data = await response.json();
    return data;
}

function CommentsScreen() {
    // return(
        
    // );
}

export default CommentsScreen;