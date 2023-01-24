import './App.css';
import FoodList from './components/FoodList/FoodList';

function App() {
	const mostRecentDate = new Date();


  	return (
		<div className='dinner-ideas'>
			<header>
				<h1>Dinner Ideas</h1>
			</header>
			<div className='food-list'>
				<FoodList
					listDate={mostRecentDate}
				/>
			</div>
		</div>
	);
}

export default App;
