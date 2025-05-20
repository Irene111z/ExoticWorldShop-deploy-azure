import React, { useState, useEffect } from 'react';
import { fetchPosts, fetchBookmarks } from '../../http/blogAPI';
import PostCard from '../../components/PostCard/PostCard';
import './Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [totalPosts, setTotalPosts] = useState(0);
  const [bookmarksIds, setBookmarksIds] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const [data, bookmarks] = await Promise.all([
          fetchPosts(currentPage, postsPerPage),
          fetchBookmarks()
        ]);
        setPosts(data.posts || []);
        setTotalPosts(data.total || 0);
        setBookmarksIds(bookmarks.rows.map(b => b.postId));
      } catch (error) {
        setError('Помилка при завантаженні постів');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [currentPage, postsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className='container-xxl container-fluid'>
      <p className='text-center blog-title my-4'>Блог</p>
      {posts.length === 0 ? (
        <p>Пости не знайдені.</p>
      ) : (
        <div className="row">
          {posts.map(post => (
            <div key={post.id} className="col-md-4 mb-4">
              <PostCard post={post} bookmarksIds={bookmarksIds}/>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-secondary"
          >
            Попередня
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-secondary"
          >
            Наступна
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;
