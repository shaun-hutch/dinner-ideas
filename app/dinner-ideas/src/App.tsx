import { Container } from '@mui/material';
import FoodList from './components/FoodList/FoodList';
import NavBar from './components/NavBar/NavBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FoodItemFormComponent from './components/FoodItemForm/FoodItemFormComponent';
import ReactDOM from 'react-dom/client';

export default function App() {

  	return (
		<BrowserRouter>
			<Routes>
					<Route path='/' element={<FoodList/>} />
					<Route path='/create' element={<FoodItemFormComponent />} />
			</Routes>
		</BrowserRouter>
	);
}

const root = ReactDOM.createRoot(document.getElementById('root')as HTMLElement);
root.render(<App />);
