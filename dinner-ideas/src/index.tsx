import React from 'react';
import ReactDOM from 'react-dom/client';
import 'index.css';
import 'primereact/resources/themes/lara-light-teal/theme.css'
import App from 'App';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import '../node_modules/primeflex/primeflex.css';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
    {
        path: "/",
        element: App()
    }
]);

root.render(
    <React.StrictMode>
        <PrimeReactProvider>
            <RouterProvider router={router} />
        </PrimeReactProvider>
    </React.StrictMode>
);
