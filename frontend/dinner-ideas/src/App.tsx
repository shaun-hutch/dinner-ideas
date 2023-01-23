import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import FoodList from './components/FoodList/FoodList';

function App() {

	const api = 'https://vf47fh2d73xkr2567uypgbcpc40pvhso.lambda-url.us-west-1.on.aws/';
    const data = { "type" : 0 };


	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(true);
		}, 2000);
	}, [isLoading])

	const response = window.fetch(api, {
		method: 'POST',
		body: JSON.stringify(data)

	}).then(response => {
		console.log(response.json());
	});


	const weekItemId = 'test';
	const mostRecentDate = new Date();



  	return (
		<div className='dinner-ideas'>
			<header>
				<h1>Dinner Ideas</h1>
			</header>
			<body>
				<FoodList
					listDate={mostRecentDate}
					weekItemId={weekItemId} 
					isLoading={isLoading}
				/>
			</body>
		</div>
  	);
}

export default App;
