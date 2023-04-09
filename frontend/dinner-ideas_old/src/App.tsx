import FoodList from './components/FoodList/FoodList';
import NavBar from './components/NavBar/NavBar';

function App() {
	const mostRecentDate = new Date();

  	return (
		<div className='dinner-ideas'>
			<NavBar/>
			


			<div className='food-list'>
				<FoodList
					listDate={mostRecentDate}
				/>
			</div>
		</div>
	);
}

export default App;
