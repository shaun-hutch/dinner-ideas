import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import { StrictMode } from "react";
import App from "./App";
import './tailwind.css';

Amplify.configure(awsExports);

const domNode = document.getElementById('root');
const root = createRoot(domNode as HTMLElement);

const signOut = () => {
    console.log('hello');
};
const user = {
    username: 'jeff'
}


root.render(
    <StrictMode>
        <App signOut={signOut} user={user}/>
    </StrictMode>
);