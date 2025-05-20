import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import './ProductsManagement.css'
import { fetchCategories, createProduct, createBrand, fetchBrands } from '../../http/productAPI';

const CreateProduct = observer(() => {
  const { product } = useContext(Context);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    disc_price: '',
    img: '',
    description: ''
  });
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState({ name: '', description: '' });
  const [categories, setCategories] = useState([]);
  const [updateData, setUpdateData] = useState({ id: "", name: "" });
  const [images, setImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [activeImage, setActiveImage] = useState(null);


  const getCategoryPath = (category, categories) => {
    const path = [];
    let current = category;

    while (current) {
      path.unshift(current.name);
      current = categories.find((c) => c.id === current.parentId);
    }

    return path.join(" > ");
  };
  useEffect(() => {
    fetchCategories().then(data => setCategories(data));
  }, []);

  useEffect(() => {
    const selectedProduct = product.products.find(p => p.id === Number(id));
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        quantity: selectedProduct.quantity,
        price: selectedProduct.price,
        disc_price: selectedProduct.disc_price,
        img: selectedProduct.img,
        description: selectedProduct.description
      });
      const productFeatures = product.getFeatures(selectedProduct.id);
      setFeatures(productFeatures);
    }
  }, [id, product.products]);

  useEffect(() => {
    const textarea = document.getElementById('description');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [formData.description]);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await fetchBrands();
        setBrands(data);
      } catch (error) {
        console.error('Помилка при завантаженні брендів:', error);
      }
    };

    loadBrands();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (images.length + newFiles.length > 6) {
      alert('Максимум 6 зображень!');
      return;
    }
    setImages(prevImages => [...prevImages, ...newFiles]);
  };

  const handleDeleteImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    if (previewIndex === index) {
      setPreviewIndex(null)
    }
  };
  const handleDeleteFeature = (id) => {
    setFeatures(features.filter(feature => feature.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.quantity || images.length === 0) {
      alert("Будь ласка, заповніть всі обов'язкові поля.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('quantity', formData.quantity);
    formDataToSend.append('price', formData.price);
    if (formData.disc_price?.toString().trim()) {
      formDataToSend.append('disc_price', formData.disc_price);
    }
    formDataToSend.append('description', formData.description);
    formDataToSend.append('categoryId', updateData.id);
    formDataToSend.append('productFeatures', JSON.stringify(features));

    if (selectedBrand === 'new') {
      try {
        const brandResponse = await createBrand(newBrandName);
        const brandId = brandResponse.id;
        formDataToSend.append('brandId', brandId);
      } catch (error) {
        console.error('Помилка при створенні бренду:', error);
        return;
      }
    } else {
      formDataToSend.append('brandId', selectedBrand);
    }

    images.forEach((image, index) => {
      formDataToSend.append('images', image);
      if (index === previewIndex) {
        formDataToSend.append('previewImageIndex', index);
      }
    });

    try {
      const response = await createProduct(formDataToSend);
      console.log('Продукт створено:', response);
      alert('Товар успішно додано!');

      // Очистити форму після успішного сабміту
      setFormData({
        name: '',
        quantity: '',
        price: '',
        disc_price: '',
        img: '',
        description: ''
      });
      setFeatures([]);
      setImages([]);
      setSelectedBrand('');
      setNewBrandName('');
      setUpdateData({ id: "", name: "" });
      setPreviewIndex(null);
    } catch (error) {
      console.error('Помилка при створенні продукту:', error);
    }
  };


  return (
    <div className='container-fluid container-xxl mb-5'>
      <p className='mt-3 admin-products-title'>Створення товару</p>
      <form className='d-flex flex-column edit-product-form' onSubmit={handleSubmit}>
        <div className="d-flex flex-column mb-2">
          <label>Зображення товару</label>
          {images.length > 0 && (
            <div className="mt-2">
              {images.map((img, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <img src="/static/delete-icon.svg" alt="" onClick={() => handleDeleteImage(index)} className='me-3'/>
                  <img
                    src={URL.createObjectURL(img)}
                    alt={img.name}
                    style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 15 }}
                  />
                  <div className="d-flex flex-column align-items-start">
                    <span className="me-3">{img.name}</span>
                    <button
                      type="button"
                      className={`${previewIndex === index ? 'image-preview-btn' : 'image-additional-btn'}`}
                      onClick={() => setPreviewIndex(index)}
                    >
                      {previewIndex === index ? 'Обкладинка' : 'Додаткове фото'}
                    </button>
                  </div>
            
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <small>Не більше 6 фото</small>
        </div>
        <div className="d-flex flex-column mb-2">
          <label htmlFor="name">Назва</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="d-flex mb-2">
          <div className="d-flex flex-column me-5">
            <label htmlFor="price">Ціна</label>
            <div className="d-flex align-items-center">
              <input className='edit-product-price me-2' type="text" name="price" id="price" value={formData.price} onChange={handleChange} />
              <p className='m-0'>грн.</p>
            </div>
          </div>
          <div className="d-flex flex-column">
            <label htmlFor="disc_price">Ціна зі знижкою</label>
            <div className="d-flex align-items-center">
              <input className='edit-product-price me-2' type="text" name="disc_price" id='disc_price' value={formData.disc_price} onChange={handleChange} />
              <p className='m-0'>грн.</p>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column mb-2">
          <label htmlFor="quantity">Кількість товару на складі</label>
          <div className="d-flex align-items-center">
            <input className='me-2 edit-product-quantity' type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} />
            <p className='m-0'>шт.</p>
          </div>
        </div>
        <div className="d-flex flex-column mb-2">
          <label htmlFor="quantity">Категорія</label>
          <div className="d-flex align-items-center">
            <select
              className="mb-2 category-input"
              value={updateData.id}
              onChange={(e) => setUpdateData({ ...updateData, id: e.target.value })}
            >
              <option value="" disabled hidden>Категорія</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryPath(category, categories)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="d-flex flex-column mb-2">
          <label htmlFor="brand">Бренд</label>
          <div className="d-flex align-items-center">
            <select
              className="mb-2 category-input"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="" disabled hidden>Оберіть бренд</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
              <option value="new">Створити новий бренд</option>
            </select>
          </div>

          {/* Якщо вибрано "створити новий бренд" */}
          {selectedBrand === 'new' && (
            <div className="d-flex flex-column mt-2">
              <label htmlFor="newBrandName">Назва нового бренду</label>
              <input
                type="text"
                id="newBrandName"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Введіть назву нового бренду"
              />
            </div>
          )}
        </div>

        <div className='mb-2 d-flex flex-column'>
          <label>Характеристики</label>
          <div className="mb-2">
            {features.length > 0 && features.map(feature => (
              <div key={feature.id} className="d-flex mb-1">
                <img src="/static/delete-icon.svg" alt="" onClick={() => handleDeleteFeature(feature.id)} className='me-3'/>
                <span><strong>{feature.name}</strong>: {feature.description}</span>
              </div>
            ))}
          </div>
          <div className="d-flex mb-2">
            <input
              type="text"
              placeholder='Характеристика'
              className='me-2'
              value={newFeature.name}
              onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
            />
            <input
              type="text"
              placeholder='Значення'
              value={newFeature.description}
              onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
            />
            <button
            type="button"
            className='add-product-feature-btn ms-2'
            onClick={() => {
              if (newFeature.name.trim() && newFeature.description.trim()) {
                setFeatures([...features, { ...newFeature, id: Date.now() }]);
                setNewFeature({ name: '', description: '' });
              }
            }}
          >
            +
          </button>
          </div>
        </div>

        <div className="d-flex flex-column mb-2 ">
          <label htmlFor="description">Опис товару</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            style={{
              resize: 'none',
              overflowY: 'hidden',
              width: '100%',
              minHeight: '40px',
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
        </div>
        <button type="submit" className='btn-save-product-changes'>Застосувати усі зміни</button>
      </form>
    </div>
  );
});

export default CreateProduct;
