import React from 'react'
import './BlogAdd.css'
import { Link } from 'react-router-dom'
import { BLOG_ROUTE } from '../../../utils/path'

const BlogAdd = () => {
  return (
    <div className='blog mt-5'>
        <div className="container-fluid container-xxl py-5">
            <p className='blog-title text-uppercase mb-2'>Вперше стали пет-батьками?</p>
            <p className='blog-text-medium mb-0'><span style={{color:'#ADFF2F'}}>Ласкаво просимо</span> у світ екзотичних улюбленців!</p>
            <p className='blog-text-small mb-5'>Якщо ви тільки починаєте свій шлях як власник унікальної тваринки, наш блог допоможе вам знайти відповіді на важливі питання. </p>
            <div className="d-flex justify-content-between mb-4">
                <div className="blog-col d-flex flex-column align-items-center me-4">
                    <div className="blog-block block1">
                        <img src='static/home_page_blog_img4.png' alt="" className='blog-block-img'/>
                        <img src='static/home_page_blog_img4_2.png' alt=""  className='blog-block-img-overlay'/>
                    </div>
                    <Link className="blog-block-title mb-3" to={BLOG_ROUTE}>Поради для новачків</Link>
                    <p className='blog-text-small'>Як уникнути типових помилок на початку? Ми розповімо про ключові моменти, які варто врахувати при догляді за вашим новим другом.</p>
                    
                </div>
                <div className="blog-col d-flex flex-column align-items-center me-4">
                    <div className="blog-block block2">
                        <img src='static/home_page_blog_img2.png' alt="" className='blog-block-img'/>
                        <img src='static/home_page_blog_img2_2.png' alt=""  className='blog-block-img-overlay'/>
                    </div>
                    <Link className="blog-block-title mb-3" to={BLOG_ROUTE}>Здоров'я і комфорт</Link>
                    <p className='blog-text-small'>Правильний догляд, збалансоване харчування та створення комфортних умов – усе це є основою щасливого життя вашого улюбленця.</p>
                </div>
                <div className="blog-col d-flex flex-column align-items-center">
                    <div className="blog-block block3">
                        <img src='static/home_page_blog_img3.png' alt="" className='blog-block-img'/>
                        <img src='static/home_page_blog_img3_2.png' alt=""  className='blog-block-img-overlay'/>
                    </div>
                    <Link className="blog-block-title mb-3" to={BLOG_ROUTE}>Ідеальне середовище</Link>
                    <p className='blog-text-small'>Як правильно облаштувати простір для вашого екзотичного улюбленця? Важливі рекомендації щодо облаштування тераріумів, кліток або вольєрів.</p>
                </div>
            </div>
            <p className='blog-text-medium m-0'>Перегляньте наш <Link className='text-uppercase' style={{color:'#ADFF2F'}} to={BLOG_ROUTE}>блог</Link>, щоб дізнатися більше!</p>
        </div>
    </div>
  )
}

export default BlogAdd