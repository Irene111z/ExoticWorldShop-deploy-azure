import React, { useState, useEffect } from 'react';
import { fetchPosts } from '../../../http/blogAPI';
import { useNavigate } from 'react-router-dom';
import { EDIT_POST_ROUTE } from '../../../utils/path';
import './PostsList.css'

const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [totalPosts, setTotalPosts] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchPosts(currentPage, postsPerPage);
                setPosts(data.posts || []);
                setTotalPosts(data.total || 0);
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

    if (loading) {
        return <p>Завантаження...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return (
        <div className='mt-5'>
            {posts.length === 0 ? (
                <p>Статті не знайдені.</p>
            ) : (
                <div className="row">
                    {posts.map(post => (
                        <div key={post.id} className="col-md-4 mb-4">
                            <div className="card">
                                <img
                                    src={post.preview}
                                    alt=""
                                    className="card-img-top"
                                />
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <h5 className="card-title">{post.title}</h5>
                                    <div className="d-flex justify-content-between align-items-end">
                                        <small className="text-muted">{new Date(post.createdAt).toLocaleDateString()}</small>
                                        <img
                                            src="/static/edit-icon.svg"
                                            className='post-edit-icon'
                                            alt="edit"
                                            onClick={() => navigate(`${EDIT_POST_ROUTE}/${post.id}`)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Пагінація */}
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

export default PostsList;
