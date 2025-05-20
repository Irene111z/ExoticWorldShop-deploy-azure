import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../../http/blogAPI';
import './PostPage.css'

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPostById(id);
        setPost(data);
      } catch (err) {
        setError('Не вдалося завантажити пост');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Пост не знайдено</div>;

  return (
    <div className="container-fluid container-xxl d-flex flex-column align-items-center">
      <div className='post-page'>
        <div className="d-flex flex-column align-items-center">
          <p className="mt-5 mb-4 post-title">{post.title}</p>
          {post.preview && (
            <img src={post.preview} alt="Прев'ю" className="mb-2 post-image" />
          )}
        </div>
        <p className='text-end mt-0 mb-5'>
        {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className="post-authors my-5">
          <p className='mb-2'>Автори статті:</p>
          {post.authors && post.authors.length > 0 ? (
            <div className="d-flex flex-column">
              {post.authors.map((author) => (
                <div key={author.id} className="mb-0">
                  <span className='post-author-name'>{author.name} {author.lastname}</span>
                  <span> – {author.occupation} ({author.workplace}, м. {author.sity})</span>
                </div>
              ))}
            </div>
          ) : (
            <span> немає</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
