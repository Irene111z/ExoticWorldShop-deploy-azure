import React, { useEffect, useState } from 'react';
import { fetchBookmarks, fetchPostById } from '../../http/blogAPI';
import PostCard from '../../components/PostCard/PostCard';
import './Bookmarks.css';

const Bookmarks = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const data = await fetchBookmarks(); // { count, rows }
        const postIds = data.rows.map(b => b.postId);
        setBookmarkedIds(postIds);

        const postPromises = postIds.map(id => fetchPostById(id));
        const posts = await Promise.all(postPromises);
        setBookmarkedPosts(posts);
      } catch (err) {
        setError('Не вдалося завантажити збережені пости');
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);
  const handleToggleBookmark = (postId) => {
    setBookmarkedPosts((prev) => prev.filter((post) => post.id !== postId));
    setBookmarkedIds((prev) => prev.filter((id) => id !== postId));
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = bookmarkedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(bookmarkedPosts.length / postsPerPage);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='container-xxl container-fluid'>
      <p className='bookmarks-title mt-3 mb-0'>Мої знахідки!</p>
      <p className='bookmarks-subtitle'>Збережені статті</p>

      {currentPosts.length === 0 ? (
        <p>Немає збережених постів.</p>
      ) : (
        <div className="row">
          {currentPosts.map(post => (
            <div key={post.id}
              className="col-md-4 mb-4">
              {console.log('Отримано пост:', post)}
              {post.id ? (
                <PostCard post={post} bookmarksIds={bookmarkedIds} onToggleBookmark={handleToggleBookmark}/>
              ) : (
                <p>Помилка завантаження поста</p>
              )}
            </div>
          ))}

        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination mb-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-secondary"
          >
            Попередня
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
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

export default Bookmarks;
