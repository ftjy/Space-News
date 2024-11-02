import React, { useState, useEffect, MouseEvent, MouseEventHandler } from 'react';
import './App.css';
import ArticlesScreen from './ArticlesScreen';
import CommentsScreen from './CommentsScreen';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ArticlesScreen />} />
        {/* <Route path="/:Id" element={<CommentsScreen />} /> */}
      </Routes>
    </Router>
  );
}


export default App;