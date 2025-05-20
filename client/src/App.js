import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom';
import './index.css'
import AppRouter from './components/AppRouter';
import Navbar from './components/Navbar/Navbar';
import AdminNavbar from './components/Navbar/AdminNavbar';
import Footer from './components/Footer/Footer';
import { observer } from 'mobx-react-lite';
import { check_token } from './http/userAPI';
import {Context} from './index'

function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (

    <>
      <div className={`app-container ${isAdminPage ? 'admin-background' : ''}`}>
        {isAdminPage ? <AdminNavbar /> : <Navbar isHomePage={isHomePage} />}
        <div className="main-content">
          <AppRouter />
        </div>
        {!isAdminPage && <Footer />}
      </div>
    </>
  );
}

const App = observer(() =>{
  const {user} = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token in localStorage:', token);
  
    if (token) {
      check_token()
        .then(data => {
          console.log('Token valid, user:', data);
          user.setUser(data);
          user.setIsAuth(true);
        })
        .catch(err => {
          console.error("Auth check failed:", err?.response?.data || err.message);
          user.setIsAuth(false);
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      console.log('No token in localStorage');
      setLoading(false);
    }
  }, []);
  
  
  if(loading){
    return <p>loading...</p>
  }

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
})

export default App;
