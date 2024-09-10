import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [inputData, setInputData] = useState('');

  // Express 서버에서 메시지를 받아오기
  useEffect(() => {
    // axios.get('http://localhost:5000/api/message')
    axios.get('https://wet-luisa-yang-yang-253f1741.koyeb.app/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  // 데이터를 POST 요청으로 보내기
  const sendData = () => {
    axios.post('http://localhost:5000/api/data', { data: inputData })
      .then(response => {
        console.log(response.data.status);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  return (
    <div className="App">
      <h1>{message}</h1>
      <input
        type="text"
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        placeholder="Enter some data"
      />
      <button onClick={sendData}>요청해봐봐봐봐봐</button>
    </div>
  );
}

export default App;
