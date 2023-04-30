import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import FoodList from "./components/FoodList/FoodList";
import { Route } from "react-router";
import FoodItemFormComponent from "./components/FoodItemForm/FoodItemFormComponent";
import { BrowserRouter, Routes } from "react-router-dom";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

interface AppProps {
	signOut: () => void;
	user: {
		username: string;
	};
}

function App(props: AppProps) {
  return (
	<>
		<Authenticator initialState="signIn">
			<BrowserRouter>
			<NavBar username={props.user.username} />
			<div className="card glass app">
				<Routes>
					<Route path='/' element={<FoodList />} />
					<Route path='/create' element={<FoodItemFormComponent />} />
				</Routes>
			</div>
			</BrowserRouter>
		</Authenticator>
	</>
  );
}

export default App;
