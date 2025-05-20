import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';
import UserContext from './context/UserContext';
import ProductContext from './context/ProductContext';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserContext(),
        product: new ProductContext()
        }}>
        <App />
    </Context.Provider>
);
