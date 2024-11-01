import React, { useState, useEffect }  from 'react';
import './App.css';
import axios from 'axios';
export default App;

// const getAllArticles = () => {
//   axios.get('http://localhost:3000/api/articles').then((response) => {
//     setData(response.data);
//     console.log(data);
//   })
// }

// const getArticleById = () => {
//   axios.get('http://localhost:3000/api/articles/:id').then((data) => {
//     console.log(data)
//   });
// }

function App() {
  const [data, setData] = useState([])

  const getAllArticles = () => {
    axios.get('http://localhost:3000/api/articles').then((response) => {
      setData(response.data);
      console.log(data);
    })
  }

  const getArticleById = () => {
    axios.get('http://localhost:3000/api/articles/:id').then((data) => {
      console.log(data)
    });
  }

  useEffect(() => {
    getAllArticles();
  }, []);

  // return (
  //   <div className="App">
  //     <h1 style={{ color: "green" }}>using Axios Library to Fetch Data</h1>
  //     <center>
  //       {[data].map((dataObj, index) => {
  //         return (
  //           <div
  //             style={{
  //               width: "15em",
  //               backgroundColor: "#CD8FFD",
  //               padding: 2,
  //               borderRadius: 10,
  //               marginBlock: 10,
  //             }}
  //           >
  //             <p style={{ fontSize: 20, color: 'white' }}>{dataObj}</p>
  //           </div>
  //         );
  //       })}
  //     </center>
  //   </div>
  // );

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={getAllArticles}>Get All Articles</button>
        <button onClick={getArticleById}>Get Article By Id</button>
      </header>
    </div>
  );
}


