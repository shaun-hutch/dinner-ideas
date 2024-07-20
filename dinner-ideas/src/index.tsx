import React from 'react';
import ReactDOM from 'react-dom/client';
import 'index.css';
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css'
import App from 'App';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';

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
