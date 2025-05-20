import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, updatePost, deletePost, fetchAuthors, createAuthor } from '../../http/blogAPI';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import {POSTS_MANAGEMENT_ROUTE} from '../../utils/path'

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: '',
    content: '',
    preview: '',
  });

  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState('');
  const [newAuthor, setNewAuthor] = useState({
    name: '',
    lastname: '',
    occupation: '',
    workplace: '',
    sity: ''
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [isCreatingNewAuthor, setIsCreatingNewAuthor] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };
  const handleDelete = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити цю статтю?')) {
      try {
        await deletePost(id);
        alert('Статтю успішно видалено.');
        navigate({POSTS_MANAGEMENT_ROUTE});
      } catch (error) {
        console.error('Помилка при видаленні поста:', error);
        alert('Не вдалося видалити статтю.');
      }
    }
  };

  // Завантажуємо дані посту та авторів
  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPostById(id)
        setPost(data);
        setSelectedAuthors(data.authors || []); 
        setPreviewUrl(data.preview);
      } catch (error) {
        console.error('Не вдалося завантажити пост:', error);
      }
    };

    fetchAuthors().then(setAuthors).catch((error) => {
      console.error("Помилка при отриманні авторів:", error);
    });

    loadPost();
  }, [id]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handlePreviewChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPost(prev => ({ ...prev, preview: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedAuthorId(value);

    if (value === 'createNew') {
      setIsCreatingNewAuthor(true);
    } else {
      setIsCreatingNewAuthor(false);
    }
  };

  const handleAddSelectedAuthor = () => {
    if (!selectedAuthorId) return;

    const id = parseInt(selectedAuthorId);
    const alreadyAdded = selectedAuthors.some(a => a.id === id);
    if (!alreadyAdded) {
      const author = authors.find(a => a.id === id);
      if (author) {
        setSelectedAuthors(prev => [...prev, author]);
      }
    }
    setSelectedAuthorId('');
  };

  const handleRemoveAuthor = (idToRemove) => {
    setSelectedAuthors(prev =>
      prev.filter(author => {
        return Number(author.id) !== Number(idToRemove);
      })
    );
  };

  const handleNewAuthorChange = (e) => {
    setNewAuthor(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddNewAuthor = async () => {
    if (newAuthor.name && newAuthor.lastname) {
      try {
        const response = await createAuthor(newAuthor);
        setAuthors(prev => [...prev, response]);
        setSelectedAuthors(prev => [...prev, response]);
        setIsCreatingNewAuthor(false);
        setSelectedAuthorId('');
        setNewAuthor({ name: '', lastname: '', occupation: '', workplace: '', sity: '' });
      } catch (error) {
        console.error("Помилка при створенні автора:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!post.title || !post.content || !post.preview || selectedAuthors.length === 0) {
      alert("Будь ласка, заповніть всі обов'язкові поля.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', post.title);
    formDataToSend.append('content', post.content);
    formDataToSend.append('preview', post.preview);  // передаємо сам файл
    selectedAuthors.forEach(author => formDataToSend.append('authorIds', author.id));

    try {
      await updatePost(id, formDataToSend);
      alert('Пост успішно оновлено!');
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Помилка при оновленні поста:', error);
    }
  };

  return (
    <div className="container create-post-form">
      <p className='posts-title mt-3'>Редагувати статтю</p>
      <form onSubmit={handleSubmit}>
        <button type="button" className="btn-delete-product mb-3" onClick={handleDelete}>Видалити статтю</button>
        <div className="d-flex">
          <div className="d-flex flex-column me-3">
            <label htmlFor="preview">Обкладинка</label>
            {previewUrl && (
              <img src={previewUrl} alt="Preview" style={{ width: '350px', height: 'auto', borderRadius: '10px' }} className='mb-2' />
            )}
            <button type="button" className="btn-add-post-preview mb-2" onClick={handleClick}>
              Змінити обкладинку
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handlePreviewChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />

            <label className="mt-3">Автори статті</label>
            {selectedAuthors.length > 0 && (
              <div className="mt-0">
                {selectedAuthors.map(author => (
                  <div key={author.id} className='d-flex align-items-center mb-2'>
                    <img src="/static/delete-icon.svg" onClick={() => handleRemoveAuthor(author.id)} alt="" />
                    <p className='mb-0 ms-3'>{author.name} {author.lastname}, {author.occupation}, {author.workplace}, м. {author.sity}</p>
                  </div>
                ))}
              </div>
            )}
            <select value={selectedAuthorId} onChange={handleSelectChange} className="mb-2">
              <option value="" disabled hidden>Оберіть автора</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>
                  {author.name} {author.lastname}, {author.workplace}
                </option>
              ))}
              <option value="createNew">Створити нового автора</option>
            </select>

            {!isCreatingNewAuthor && selectedAuthorId && selectedAuthorId !== 'createNew' && (
              <button type="button" onClick={handleAddSelectedAuthor} className='btn-add-author-to-post'>Зазначити як автора</button>
            )}

            {isCreatingNewAuthor && (
              <div className="d-flex flex-column mt-3 create-author-form">
                <h4>Новий автор</h4>
                <input name="name" className="mb-2" placeholder="Ім’я" value={newAuthor.name} onChange={handleNewAuthorChange} />
                <input name="lastname" className="mb-2" placeholder="Прізвище" value={newAuthor.lastname} onChange={handleNewAuthorChange} />
                <input name="occupation" className="mb-2" placeholder="Професія" value={newAuthor.occupation} onChange={handleNewAuthorChange} />
                <input name="workplace" className="mb-2" placeholder="Місце роботи" value={newAuthor.workplace} onChange={handleNewAuthorChange} />
                <input name="sity" className="mb-2" placeholder="Місто" value={newAuthor.sity} onChange={handleNewAuthorChange} />
                <button type="button" onClick={handleAddNewAuthor} className='btn-create-author'>Створити автора</button>
              </div>
            )}
          </div>
          <div className="d-flex flex-column w-100">
            <label htmlFor="title">Заголовок</label>
            <input name="title" className="mb-2" value={post.title} onChange={handleInputChange} />

            <label htmlFor="content">Контент</label>
            <ReactQuill
              theme="snow"
              value={post.content}
              onChange={(value) => setPost(prev => ({ ...prev, content: value }))}
              className="mb-2"
              style={{ backgroundColor: 'white' }}
            />
          </div>
        </div>
        <button type="submit" className="mt-3 mb-5 btn-create-post">Оновити пост</button>
      </form>
    </div>
  );
};

export default EditPost;
