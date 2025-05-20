import { $authHost, $host } from './index';

//КАТЕГОРІЇ
// Отримати всі категорії
export const fetchCategories = async () => {
    const { data } = await $host.get('/api/category');
    return data;
};
// Отримати підкатегорії
export const fetchSubcategories = async (parentId) => {
    const { data } = await $host.get(`/api/category/${parentId}/subcategories`);
    return data;
};
// Створити нову категорію
export const createCategory = async (category) => {
    const { data } = await $authHost.post('/api/category', category);
    return data;
};
// Оновити категорію
export const updateCategory = async (id, body) => {
    const { data } = await $authHost.put(`/api/category/${id}`, body);
    return data;
};
// Видалити категорію
export const deleteCategory = async (id) => {
    const { data } = await $authHost.delete(`/api/category/${id}`);
    return data;
};


// ТОВАРИ
// Створити новий товар
export const createProduct = async (formData) => {
    const { data } = await $authHost.post('/api/product', formData);
    return data;
};
//Створити новий бренд
export const createBrand = async (brandName) => {
    const { data } = await $authHost.post('/api/brand', { name: brandName });
    return data;
};
// Отримати всі бренди
export const fetchBrands = async () => {
    const { data } = await $authHost.get('/api/brand');
    return data;
};
// Отримати всі товари
export const fetchProducts = async (params = {}) => {
    const { data } = await $host.get('api/product', { params });
    return data;
};
// Отримати товари за ід
export const fetchProductsByIds = async (ids) => {
  const { data } = await $host.post('api/product/by-ids', { ids });
  return data;
};
// Отримати товар за ID
export const fetchProductById = async (id) => {
    const { data } = await $host.get(`/api/product/${id}`);
    return data;
};
// Оновити товар
export const updateProduct = async (id, product) => {
    const { data } = await $authHost.put(`/api/product/${id}`, product);
    return data;
};
// Видалити товар
export const deleteProduct = async (id) => {
    const { data } = await $authHost.delete(`/api/product/${id}`);
    return data;
};
// Пошук товарів за назвою
export const searchProducts = async (query) => {
    const { data } = await $host.get(`/api/product/search`, { params: { name: query } });
    return data;
};

// ВІДГУКИ
// Отримати відгуки до товару
export const fetchProductReviews = async (productId) => {
    const { data } = await $host.get(`/api/product/${productId}/reviews`);
    return data;
};
// Додати відгук до товару
export const addProductReview = async (productId, review) => {
    console.log("Отримані дані від фронтенду:", review);
    console.log("productId", productId);
    const { data } = await $authHost.post(`/api/product/${productId}/reviews`, review);
    return data;
};
// Видалити відгук
export const deleteProductReview = async (reviewId) => {
    const { data } = await $authHost.delete(`/api/product/reviews/${reviewId}`);
    return data;
};

// СПИСОК БАЖАНЬ
// Додати в бажане
export const addProductToWishlist = async (productId) => {
  const { data } = await $authHost.post(`/api/wishlist/product`, { productId });
  return data;
};
// Вивести товари з бажаного
export const fetchWishlist = async () => {
    const { data } = await $authHost.get(`/api/wishlist`);
    return data;
}
// Видалити товар з бажаного
export const deleteProductFromWishlist = async (productId) => {
    const { data } = await $authHost.delete(`/api/wishlist/product/${productId}`);
    return data;
}

//КОШИК
// Отримати усі товари у кошику
export const fetchCart = async () => {
  const { data } = await $authHost.get(`/api/cart`);
  return data;
};
// Додати товар у кошик
export const addProductToCart = async (productId, quantity = 1) => {
  const { data } = await $authHost.post(`/api/cart/item`, { productId, quantity });
  return data;
};
// Збільшити кількість одиниць товару
export const increaseCartItem = async (productId) => {
  const { data } = await $authHost.put(`/api/cart/incItem`, { productId });
  return data;
};
// Зменшити кількість одиниць товару
export const decreaseCartItem = async (productId) => {
  const { data } = await $authHost.put(`/api/cart/decItem`, { productId });
  return data;
};
// Видалити товар з кошика
export const deleteProductFromCart = async (productId) => {
  const { data } = await $authHost.delete(`/api/cart/item/${productId}`);
  return data;
};
// Очистити кошик
export const clearCart = async () => {
  const { data } = await $authHost.delete(`/api/cart`);
  return data;
};
