import "./App.scss";
import NavBar from "./components/NavBar/NavBar";
import FoodList from "./components/FoodList/FoodList";
import { Route } from "react-router";
import FoodItemFormComponent from "./components/FoodItemForm/FoodItemFormComponent";
import { BrowserRouter, Routes } from "react-router-dom";

export default function App() {
  return (
    <>
		<BrowserRouter>
		<NavBar />
			<div>
				<Routes>
					<Route path='/' element={<FoodList />} />
					<Route path='/create' element={<FoodItemFormComponent />} />
				</Routes>
			</div>
		</BrowserRouter>
    </>
  );
}
