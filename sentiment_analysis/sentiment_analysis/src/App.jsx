import React, { useState } from 'react';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [sentimentResult, setSentimentResult] = useState(null);
  const [error, setError] = useState(null);

  const analyzeSentiment = async () => {
    try {
      const response = await fetch('http://localhost:5000/analyze_sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: inputText })
      });

      if (!response.ok) {
        throw new Error('An error occurred while analyzing sentiment');
      }

      const data = await response.json();
      setSentimentResult(data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setSentimentResult(null);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={inputText} 
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={analyzeSentiment}>Analyze Sentiment</button>
      {error && <p>Error: {error}</p>}
      {sentimentResult && (
        <div>
          <p>Sentiment Label: {sentimentResult.label}</p>
          <p>Sentiment Score: {sentimentResult.score}</p>
        </div>
      )}
    </div>
  );
};


export default App;