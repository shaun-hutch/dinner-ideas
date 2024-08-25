import React from 'react';
import ReactDOM from 'react-dom/client';
import 'index.css';
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css';
import App from 'App';
import { PrimeReactProvider } from 'primereact/api';
import '../node_modules/primeflex/primeflex.css';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <PrimeReactProvider>
            <App/>
        </PrimeReactProvider>
    </React.StrictMode>
);
