import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import './index.css';

fetch('http://localhost:4000/upload', {
method: 'POST',
headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
body: JSON.stringify({count: 10})
}).then(response => {
response.json().then(body => {
console.log(body.count);
});
});


ReactDOM.render(<App />, document.getElementById('root'));
