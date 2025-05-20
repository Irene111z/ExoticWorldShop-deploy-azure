import { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import './ProductPage.css';
import AuthForm from '../../components/AuthForm/AuthForm';
import ProductCard from '../../components/ProductCard/ProductCard';
import { fetchProductById, fetchCategories, fetchProducts, addProductReview, fetchProductReviews, fetchWishlist, addProductToWishlist, deleteProductFromWishlist, addProductToCart, fetchCart } from '../../http/productAPI';
import { HOMEPAGE_ROUTE, CATALOG_ROUTE, PRODUCT_ROUTE } from '../../utils/path';

const ProductPage = observer(() => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [categoryPath, setCategoryPath] = useState([]);
  const { user } = useContext(Context);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [quantityInCart, setQuantityInCart] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, allCategories] = await Promise.all([fetchProductById(id), fetchCategories()]);
        setProduct(data);
        if (user?.isAuth) {
          fetchWishlist()
            .then(items => {
              const ids = items.rows.map(item => item.productId);
              setWishlistIds(ids);
              setInWishlist(ids.includes(data.id));
            })
            .catch(err => {
              console.error("Помилка при отриманні вішліста", err);
              setInWishlist(false);
            });
        }
        const similar = await fetchProducts({ categoryId: data.categoryId });
        const filtered = similar.rows.filter((item) => item.id !== data.id);
        setSimilarProducts(filtered);
        setActiveImage(data.images[0]?.img || '');

        const reviewsData = await fetchProductReviews(id);
        setReviews(reviewsData.rows);
        if (user?.isAuth) {
          try {
            const cartData = await fetchCart();
            console.log("cart data", cartData)
            setCartItems(cartData.cart_items || []);
            const itemInCart = cartData.cart_items.find(item => item.productId === data.id);
            setQuantityInCart(itemInCart ? itemInCart.quantity : 0);
          } catch (error) {
            console.error('Помилка при отриманні кошика', error);
          }
        }
        // Перевіряємо, чи користувач залишав відгук
        const userReview = reviewsData.rows.find((review) => review.user.id === user.userId);

        console.log(userReview)
        if (userReview) {
          setHasReviewed(true);
        } else {
          setHasReviewed(false);
        }
        console.log(hasReviewed)

        const buildCategoryPath = (id, categories, path = []) => {
          const category = categories.find((cat) => String(cat.id) === String(id));
          if (!category) return path;
          path.unshift({ id: category.id, name: category.name });
          if (category.parentId) {
            return buildCategoryPath(category.parentId, categories, path);
          }
          return path;
        };

        const fullPath = buildCategoryPath(data.categoryId, allCategories);
        setCategoryPath(fullPath);
      } catch (error) {
        console.error('Помилка при отриманні товару або категорій:', error);
      }
    };

    fetchData();
  }, [id, user.id]);

  const handleSubmitReview = async () => {
    if (!rating) {
      setError("Оцінка обов'язкова");
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const review = {
        rate: rating,
        comment: reviewText
      };
      await addProductReview(product.id, review);

      // Додати новий відгук до списку відгуків
      const updatedReviews = await fetchProductReviews(product.id);
      setReviews(updatedReviews.rows);

      // Приховати форму відгуку після надсилання
      setShowReviewForm(false);

      setRating(0);
      setReviewText('');
    } catch (e) {
      setError(e.response?.data?.message || 'Помилка при надсиланні відгуку');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user.isAuth) {
      handleProtectedClick(`${PRODUCT_ROUTE}/${product.id}`);
      return;
    }

    try {
      if (inWishlist) {
        await deleteProductFromWishlist(product.id);
        setInWishlist(false);
      } else {
        await addProductToWishlist(product.id);
        setInWishlist(true);
      }
    } catch (err) {
      console.error('Помилка з вішлістом:', err);
    }
  };
  const availableQuantity = product && product.quantity ? product.quantity - quantityInCart : 0;
  const handleQuantityChange = (e) => {
    const val = Number(e.target.value);
    if (availableQuantity <= 0) {
      setQuantity(0);
    } else if (val < 1) {
      setQuantity(1);
    } else if (val > availableQuantity) {
      setQuantity(availableQuantity);
    } else {
      setQuantity(val);
    }
  };
  const handleAddToCart = async () => {
    try {
      await addProductToCart(product.id, quantity);

      const cartData = await fetchCart();
      const items = Array.isArray(cartData?.cart_items) ? cartData.cart_items : [];
      setCartItems(items);

      const itemInCart = items.find(item => item.productId === product.id);
      setQuantityInCart(itemInCart?.quantity || 0);
      setQuantity(1);
    } catch {
      alert('Не вдалося додати товар до кошика');
    }
  };

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  const handleProtectedClick = (redirectPath) => {
    localStorage.setItem('redirectUrl', redirectPath);
    openAuthModal();
  };

  if (!product) return <div>Завантаження...</div>;

  return (
    <div className='product-page d-flex flex-column justify-content-between container-fluid container-xxl my-5' style={{ backgroundColor: '#fff', borderRadius: '20px' }}>
      <div className="row mt-5">
        <span className='product-breadcrumbs text-center mb-4'>
          <Link to={HOMEPAGE_ROUTE}>ExoWorld</Link>{' > '}
          {categoryPath.map((cat, index) => {
            const isLast = index === categoryPath.length;
            return (
              <span key={cat.id}>
                {!isLast ? (
                  <Link to={`${CATALOG_ROUTE}/${cat.id}`}>{cat.name}</Link>
                ) : (
                  <span>{cat.name}</span>
                )}
                {' > '}
              </span>
            );
          })}
          <span className='product-breadcrumbs-disabled'>{product.name}</span>
        </span>
        <div className={product.quantity > 0 ? "col-4 offset-1 product-slider flex-column" : "col-4 offset-1 product-slider gray-images flex-column"}>
          <div className="active mb-3">
            {activeImage && <img src={activeImage} alt="Товар" />}
            {product.disc_price ? (
              <div className="product-sale">
                -{(((product.price - product.disc_price) / product.disc_price) * 100).toFixed(0)}%
              </div>
            ) : <span></span>}
          </div>
          <div className="controls d-flex justify-content-start">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image.img}
                alt=""
                className={activeImage === image.img ? 'selected me-3' : 'me-3'}
                onClick={() => setActiveImage(image.img)}
              />
            ))}
          </div>
        </div>
        <div className="col-5 offset-1 d-flex flex-column product-base-info">
          <p className='product-name mb-2'>{product.name}</p>
          <div className="d-flex justify-content-between align-items-end mb-2">
            <div className="">
              {[...Array(5)].map((_, idx) => (
                <img key={idx} src={idx < product.averageRating ? '/static/star-filled.svg' : '/static/star-empty.svg'} alt="" />
              ))}
            </div>
            <p className='product-id mb-0'>Код товару: {product.id}</p>
          </div>
          <hr className='my-2' />
          <div className="d-flex align-items-end">
            <p className={product.quantity > 0 ? 'me-3 product-new-price mb-0' : 'me-3 product-new-price-disabled mb-0'}>{product.price} ₴</p>
            {product.disc_price ? (<p className='product-old-price mb-1'>{product.disc_price} ₴</p>) : <span></span>}
          </div>
          <hr className='my-2' />
          {product.quantity > 0 ? <p className='product-availible mb-2'>В наявності</p> : <p className='product-not-availible mb-2'>Немає в наявності</p>}
          <div className="d-flex mb-2">
            {product && (
              <>
                <input
                  type="number"
                  min={availableQuantity > 0 ? 1 : 0}
                  max={availableQuantity}
                  value={availableQuantity > 0 ? quantity : 0}
                  onChange={handleQuantityChange}
                  className="form-control me-2"
                  style={{ width: '70px' }}
                  disabled={availableQuantity <= 0}
                />
                {product.quantity > 0 && availableQuantity > 0 ? (
                  <div className="d-flex flex-column">
                    <button className="btn-add-to-cart me-3" onClick={handleAddToCart}>
                      Купити
                    </button>
                  </div>
                ) : (
                  <button className="btn-add-to-cart-disabled me-3" disabled>
                    Купити
                  </button>
                )}
              </>
            )}
            <img
              src={inWishlist ? '/static/wishlist-filled.svg' : '/static/wishlist-empty.svg'}
              alt="wishlist"
              style={{ cursor: 'pointer' }}
              onClick={handleWishlistToggle}
            />
          </div>
          {availableQuantity <= 0 && (
            <small className="text-danger mb-2">Ви вже додали  до кошика максимальну кількість товару, що є на складі</small>
          )}
          <hr className='my-2' />
          <p className='product-delivery-title mb-2'>Доставка</p>
          <div className="d-flex flex-column mb-3">
            <div className="d-flex mb-1">
              <div className="product-page-delivery-icon">
                <img src='/static/delivery-store.svg' alt="" />
              </div>
              <p className='my-0 ms-3 product-delivery-text'>Самовивіз безкоштовно</p>
            </div>
            <div className="d-flex mb-1">
              <div className="product-page-delivery-icon">
                <img src='/static/delivery-nova-poshta.svg' alt="" />
              </div>
              <p className='my-0 ms-3 product-delivery-text'>Нова Пошта від 70 грн</p>
            </div>
            <div className="d-flex">
              <div className="product-page-delivery-icon">
                <img src='/static/delivery-ukr-poshta.svg' alt="" />
              </div>
              <p className='my-0 ms-3 product-delivery-text'>Укрпошта від 40 грн</p>
            </div>
          </div>
          <p className='product-delivery-title mb-2'>Оплата</p>
          <p className='product-delivery-text mb-1'>Онлайн на реквізити</p>
          <p className='product-delivery-text m-0'>Оплата при отриманні</p>
        </div>
      </div>
      <div className="row my-5">
        <div className="col-10 offset-1">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="features-tab" data-bs-toggle="tab" data-bs-target="#features" type="button" role="tab" aria-controls="features" aria-selected="true">Характеристики</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab" aria-controls="description" aria-selected="false">Опис товару</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab" aria-controls="reviews" aria-selected="false">Відгуки</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="similar-tab" data-bs-toggle="tab" data-bs-target="#similar" type="button" role="tab" aria-controls="similar" aria-selected="false">Схожі товари</button>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="features" role="tabpanel" aria-labelledby="features-tab">
              <div className="d-flex flex-column mt-4 mb-3">
                {(product.productFeatures || []).map((feature) => (
                  <p key={feature.id} className='features-title mb-2'>
                    {feature.name}: <span style={{ fontWeight: '400', color: "#858585" }}>{feature.description}</span>
                  </p>
                ))}
              </div>
            </div>
            <div className="tab-pane fade" id="description" role="tabpanel" aria-labelledby="description-tab">
              <div className="mt-4 mb-4">
                <p>{product.description}</p>
              </div>
            </div>
            <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
              <div className="d-flex flex-column">
                {user.isAuth && !hasReviewed && showReviewForm ? (
                  <div className="review-form mt-3">
                    <p className="mb-2">Ваш відгук:</p>
                    <div className="d-flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <img
                          key={star}
                          src={star <= rating ? '/static/star-filled.svg' : '/static/star-empty.svg'}
                          alt=""
                          onClick={() => setRating(star)}
                          style={{ cursor: 'pointer', width: '24px', marginRight: '5px' }}
                        />
                      ))}
                    </div>
                    <textarea
                      className="form-control textarea-review mb-2"
                      rows="3"
                      placeholder="Опишіть ваші враження про продукт."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                    <button className="btn-add-review" onClick={handleSubmitReview}>
                      Надіслати відгук
                    </button>
                  </div>
                ) : !user.isAuth ? (
                  <div>
                    Щоб залишити відгук, <span onClick={() => handleProtectedClick(`${PRODUCT_ROUTE}/${product.id}`)} style={{ color: '#2274A5', cursor: 'pointer' }}>увійдіть у профіль</span>.
                  </div>
                ) : (
                  <p className="mt-3 mb-0">Ви вже залишили відгук для цього товару.</p>
                )}

                {/* Відгуки користувачів */}
                <div className="existing-reviews">
                  {(reviews?.length || 0) > 0 ? reviews.map((review) => (
                    <div key={review.id} className="d-flex flex-column mt-4">
                      <hr className="mt-0" />
                      <div className="d-flex justify-content-between">
                        <div className="d-flex">
                          <img
                            src={review.user?.img || '/static/review-img.png'}
                            alt={review.user?.name || 'User'}
                            className="review-person-img me-3"
                          />
                          <div className="mt-3">
                            <p className="review-person-name mb-0">{review.user?.name} {review.user?.lastname}</p>
                            <div className="rating-stars">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <img
                                  key={star}
                                  src={star <= review.rate ? '/static/star-filled.svg' : '/static/star-empty.svg'}
                                  alt=""
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="mt-3">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className="mt-3">{review.comment}</p>
                    </div>
                  )) : <p className="mt-3">На цей товар ще ніхто не залишив відгук. Станьте першим, хто це зробить!</p>}
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="similar" role="tabpanel" aria-labelledby="similar-tab">
              <div className="d-flex flex-wrap justify-content-between mt-4">
                {similarProducts.map((product) => (
                  <ProductCard key={product.id} product={product} wishlistIds={wishlistIds} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAuthModal && <AuthForm show={showAuthModal} onClose={closeAuthModal} />}
    </div>
  );
});

export default ProductPage;
