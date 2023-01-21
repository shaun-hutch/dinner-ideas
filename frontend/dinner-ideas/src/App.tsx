import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Auth } from '@aws-amplify/auth';
import Lambda from 'aws-sdk/clients/lambda';
function App() {

	// const api = 'https://ucfizrks22.execute-api.us-west-1.amazonaws.com/default/dinner-ideas';
    // const data = { "type" : "Read" };

	Auth.currentCredentials()
	.then(credentials => {
		const lambda = new Lambda(
		{
			credentials: Auth.essentialCredentials(credentials)
		});
		lambda.invoke({
		FunctionName: 'dinner-ideas',
		Payload: JSON.stringify({ type: 0 }),
		}, function(err, data){
			if (err) console.log(err, err.stack);
			else console.log(data);
		});
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
