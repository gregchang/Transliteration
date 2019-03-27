import React from 'react';
import InputBox from './InputBox';
import OutputBox from './OutputBox';

const App = () => {
  return (
    <div>
      <h2 style={{margin: '2em 0'}} className="ui center aligned header title-text">Chinese Transliteration and Romanization Tool</h2>
      <div className="ui container">
        <InputBox />
        <OutputBox />
      </div>
    </div>
  );
}

export default App;