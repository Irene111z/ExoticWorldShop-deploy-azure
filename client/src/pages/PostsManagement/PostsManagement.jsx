import React from 'react'
import './PostsManagement.css'
import { CREATE_POST_ROUTE, EDIT_POST_ROUTE } from '../../utils/path'
import { useNavigate } from "react-router-dom"
import PostsList from '../../components/AdminPages/PostsList/PostsList'

const PostsManagement = () => {
  const navigate = useNavigate();
  return (
    <div className='container-fluid container-xxl posts-page'>
      <p className='posts-title mt-3'>Статті</p>
      <div className="d-flex justify-content-between">
        <input type="text" placeholder='Пошук' className='search-post-admin' hidden/>
        <button className='add-post-link' onClick={() => navigate(`${CREATE_POST_ROUTE}`)}>Створити статтю</button>
      </div>
      <PostsList/>
    </div>
  )
}

export default PostsManagement