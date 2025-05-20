import { $host, $authHost } from './index';

// Створити пост
export const createPost = async (formData) => {
  const { data } = await $authHost.post('/api/blog', formData);
  return data;
};

// Отримати всі пости
export const fetchPosts = async (page = 1, limit = 5) => {
  const { data } = await $host.get('/api/blog', {
    params: { page, limit },
  });
  return data;
};

// Отримати повний пост по id
export const fetchPostById = async (id) => {
  const { data } = await $host.get(`/api/blog/${id}`);
  return data;
};

// Оновити пост
export const updatePost = async (id, formData) => {
  const { data } = await $authHost.put(`/api/blog/${id}`, formData);
  return data;
};

// Видалити пост
export const deletePost = async (id) => {
  const { data } = await $authHost.delete(`/api/blog/${id}`);
  return data;
};

// АВТОРИ
// Отримати всіх авторів
export const fetchAuthors = async () => {
  const { data } = await $host.get('/api/author');
  return data;
};

// Створити нового автора
export const createAuthor = async (authorData) => {
  const { data } = await $authHost.post('/api/author', authorData);
  return data;
};

// Оновити інформацію про автора
export const updateAuthor = async (id, authorData) => {
  const { data } = await $authHost.put(`/api/author/${id}`, authorData);
  return data;
};

// Видалити автора
export const deleteAuthor = async (id) => {
  const { data } = await $authHost.delete(`/api/author/${id}`);
  return data;
};

// Отримати автора за id
export const fetchAuthorById = async (id) => {
  const { data } = await $host.get(`/api/author/${id}`);
  return data;
};

//ЗБЕРЕЖЕНІ СТАТТІ
// Зберегти статтю
export const addPostToBookmarks = async (postId) => {
  const { data } = await $authHost.post(`/api/bookmarks/post`, { postId });
  return data;
};
// Видалити статтю зі збереженого
export const deletePostFromBookmarks = async (postId) => {
  const { data } = await $authHost.delete(`/api/bookmarks/post/${postId}`);
  return data;
}
// Отримати збережені статті
export const fetchBookmarks = async () => {
  const { data } = await $authHost.get(`/api/bookmarks`);
  return data;
}