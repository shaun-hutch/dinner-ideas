import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import FoodList from "./components/FoodList/FoodList";
import { Route } from "react-router";
import FoodItemFormComponent from "./components/FoodItemForm/FoodItemFormComponent";
import { BrowserRouter, Routes } from "react-router-dom";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { createContext, useCallback, useState } from "react";

export const UserContext = createContext(null);

function App() {

	const [loggedInUser, setLoggedInUser] = useState(null);

	const onSetUser = useCallback((user: any) => {
		console.log('user', user);
		setLoggedInUser(user);
	},[setLoggedInUser]);




  	return (
	<>
		<Authenticator initialState="signIn">
			<UserContext.Provider value={loggedInUser}>
				<BrowserRouter>
				<NavBar onUserChange={onSetUser}/>
				<div className="card glass app">
					<Routes>
						<Route path='/' element={<FoodList />} />
						<Route path='/create' element={<FoodItemFormComponent />} />
					</Routes>
				</div>
				</BrowserRouter>
			</UserContext.Provider>
		</Authenticator>
	</>
  );
}

export default App;
