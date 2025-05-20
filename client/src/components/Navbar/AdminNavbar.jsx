import React, { useContext } from 'react'
import './AdminNavbar.css'
import { NavLink } from 'react-router-dom'
import { ORDERS_MANAGEMENT_ROUTE, CATEGORIES_MANAGEMENT_ROUTE, PRODUCTS_MANAGEMENT_ROUTE, POSTS_MANAGEMENT_ROUTE, HOMEPAGE_ROUTE } from '../../utils/path';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index';

const AdminNavbar = () => {
  const {user} = useContext(Context)

  const navigate = useNavigate();
  const logout=()=>{
    user.setUser({})
    user.setIsAuth(false)
    localStorage.removeItem('token');
    navigate(HOMEPAGE_ROUTE);
  }

  return (
    <div className='admin-navbar'>
        <nav className='d-flex container-xxl d-flex justify-content-between py-4'>
            <div className='d-flex admin-navbar-link'>
                <NavLink to={ORDERS_MANAGEMENT_ROUTE} className={({ isActive }) => isActive ? 'me-5 admin-link-active' : 'me-5'}>Замовлення</NavLink>
                <NavLink to={CATEGORIES_MANAGEMENT_ROUTE} className={({ isActive }) => isActive ? 'me-5 admin-link-active' : 'me-5'}>Категорії</NavLink>
                <NavLink to={PRODUCTS_MANAGEMENT_ROUTE} className={({ isActive }) => isActive ? 'me-5 admin-link-active' : 'me-5'}>Товари</NavLink>
                <NavLink to={POSTS_MANAGEMENT_ROUTE} className={({ isActive }) => isActive ? 'admin-link-active' : ''}>Статті</NavLink>
            </div>
            <button className='admin-navbar-btn-logout' onClick={() => logout()}>
                Вийти
            </button>
        </nav>
    </div>
  )
}

export default AdminNavbar