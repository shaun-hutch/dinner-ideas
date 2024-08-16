import React from 'react';
import ReactDOM from 'react-dom/client';
import 'index.css';
import 'primereact/resources/themes/lara-light-teal/theme.css'
import 'primeicons/primeicons.css';
import App from 'App';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import '../node_modules/primeflex/primeflex.css';
import Navbar from 'components/Navbar/Navbar';
import DinnerItemEditor from 'components/DinnerItemEditor/DinnerItemEditor';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const NavbarWrapper = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    )
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <NavbarWrapper/>,
        children: [
            {
                path: "/",
                element: <App />
            },
            {
                path: "/create",
                element: <>create page</>
            },
            {
                path: "/generate",
                element: <>generate page</>
            },
            {
                path: "/edit/:dinnerItemId",
                element: <DinnerItemEditor />
            },
            {
                path: "/view/:dinnerItemId",
                element: <DinnerItemEditor readOnly={true} />
            }
        ]
    }
]);

root.render(
    <React.StrictMode>
        <PrimeReactProvider>
            <RouterProvider router={router} />
        </PrimeReactProvider>
    </React.StrictMode>
);
