import React, { useState, useEffect, MouseEvent, MouseEventHandler } from 'react';
import './App.css';
import { NavigationContainer } from '@react-navigation/native';
import ArticlesScreen from './ArticlesScreen';
import CommentsScreen from './CommentsScreen';


function App() {

  return (
    <NavigationContainer>
      <ArticlesScreen />
      {/* <CommentsScreen /> */}
    </NavigationContainer>
  );
}


export default App;