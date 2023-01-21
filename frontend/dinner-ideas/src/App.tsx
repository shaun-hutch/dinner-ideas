import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

	const api = 'https://ucfizrks22.execute-api.us-west-1.amazonaws.com/default/dinner-ideas';
    const data = { "type" : "Read" };

	const response = await window.fetch(api, {
		method: 'POST',
		body: JSON.stringify(data);

	});

	console.log(response.json());

  	return (
		<div className="App">
			<header className="App-header">
			<img src={logo} className="App-logo" alt="logo" />
			<p>
				Edit <code>src/App.tsx</code> and save to reload.
			</p>
			<a
				className="App-link"
				href="https://reactjs.org"
				target="_blank"
				rel="noopener noreferrer"
			>
				Learn React
			</a>
			</header>
    	</div>
  	);
}

export default App;
