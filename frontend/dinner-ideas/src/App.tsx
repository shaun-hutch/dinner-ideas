import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

	const api = 'https://vf47fh2d73xkr2567uypgbcpc40pvhso.lambda-url.us-west-1.on.aws/';
    const data = { "type" : 0 };

	const response = window.fetch(api, {
		method: 'POST',
		body: JSON.stringify(data)

	}).then(response => {
		console.log(response);
	});




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
