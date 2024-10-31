import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const getAllArticles = () => {
  axios.get('http://localhost:3000/api/articles').then((data) => {
    console.log(data)
  })
}

const getArticleById = () => {
  axios.get('http://localhost:3000/api/articles/:id').then((data) => {
    console.log(data)
  });
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={getAllArticles}>Get All Articles</button>
        <button onClick={getArticleById}>Get Article By Id</button>
      </header>
    </div>
  );


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
}

export default App;
