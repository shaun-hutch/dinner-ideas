import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import { StrictMode } from "react";
import App from "./App";

Amplify.configure(awsExports);

const domNode = document.getElementById('root');
const root = createRoot(domNode as HTMLElement);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);