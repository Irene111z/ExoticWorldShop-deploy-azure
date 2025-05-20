import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import './ProductsManagement.css'
import { fetchCategories, createBrand, fetchBrands, fetchProductById, updateProduct, deleteProduct } from '../../http/productAPI';

const EditProduct = observer(() => {
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
    fetchBrands().then(data => setBrands(data));
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setFormData({
          name: data.name,
          quantity: data.quantity,
          price: data.price,
          disc_price: data.disc_price || '',
          img: '',
          description: data.description || '',
        });

        // Ставимо існуючі фото з сервера
        const serverImages = data.images?.map(img => ({
          ...img,
          isNew: false // позначка, що це не File, а URL
        })) || [];
        setImages(serverImages);
        const preview = serverImages.findIndex(img => img.isPreview);
        setPreviewIndex(preview !== -1 ? preview : null);

        console.log('Product features:', data.productFeatures);
        setFeatures(
          (data.productFeatures || []).map((f) => ({
            ...f,
            uid: Date.now() + Math.random(), // щоб був унікальний ключ
          }))
        );

        setSelectedBrand(data.brandId || '');
        setUpdateData({ id: data.categoryId || '', name: '' });
      } catch (error) {
        console.error('Помилка при завантаженні товару:', error);
      }
    };

    loadProduct();
  }, [id]);

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
      setPreviewIndex(null);
    }
  };

  const handleDeleteFeature = (id) => {
    setFeatures(features.filter(feature => feature.id !== id));
  };

  const handleDeleteProduct = async () => {
    const confirm = window.confirm("Ви впевнені, що хочете видалити цей товар? Цю дію неможливо скасувати.");
    if (!confirm) return;

    try {
      await deleteProduct(id);
      alert("Товар успішно видалено!");
      window.location.href = "/admin/products"; // або navigate, якщо хочеш useNavigate
    } catch (error) {
      console.error("Помилка при видаленні товару:", error);
      alert("Помилка при видаленні товару");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.quantity) {
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

    images.forEach((image) => {
      if (image.isNew !== false) {
        formDataToSend.append('images', image);
      }
    });

    formDataToSend.append('previewImageIndex', String(previewIndex));

    // Додаємо старі зображення
    const oldImageUrls = images
      .filter((img) => img.isNew === false)
      .map((img, index) => ({
        img: img.img,
        isPreview: index === previewIndex
      }));


    formDataToSend.append('oldImages', JSON.stringify(oldImageUrls));
    
    console.log("Preview index:", previewIndex);
    console.log("Old images:", oldImageUrls);
    try {
      const response = await updateProduct(id, formDataToSend);
      console.log('Товар оновлено:', response);
      alert('Товар успішно оновлено!');
    } catch (error) {
      console.error('Помилка при оновленні товару:', error);
    }
  };


  return (
    <div className='container-fluid container-xxl mb-5'>
      <p className='mt-3 admin-products-title'>Створення товару</p>
      <form className='d-flex flex-column edit-product-form' onSubmit={handleSubmit}>
        <button type="button" className="btn-delete-product mb-3" onClick={handleDeleteProduct}>Видалити товар</button>
        <div className="d-flex flex-column mb-2">
          <label>Зображення товару</label>
          {images.length > 0 && (
            <div className="mt-2">
              {images.map((img, index) => {
                const isNew = img.isNew !== false;
                const src = isNew ? URL.createObjectURL(img) : img.img;

                return (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <img src="/static/delete-icon.svg" alt="" onClick={() => handleDeleteImage(index)} className='me-3' />
                    <img
                      src={src}
                      alt={`img-${index}`}
                      style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 15 }}
                    />
                    <div className="d-flex flex-column align-items-start">
                      <span className="me-3">{isNew ? img.name : 'Існуюче фото'}</span>
                      <button
                        type="button"
                        className={`${previewIndex === index ? 'image-preview-btn' : 'image-additional-btn'}`}
                        onClick={() => setPreviewIndex(index)}
                      >
                        {previewIndex === index ? 'Обкладинка' : 'Додаткове фото'}
                      </button>
                    </div>
                  </div>
                );
              })}
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
              <option value="" disabled hidden>Виберіть бренд</option>
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
              <div key={feature.id || feature.uid} className="d-flex mb-1">
                <img src="/static/delete-icon.svg" alt="" onClick={() => handleDeleteFeature(feature.id || feature.uid)} className='me-3' />
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

export default EditProduct;
