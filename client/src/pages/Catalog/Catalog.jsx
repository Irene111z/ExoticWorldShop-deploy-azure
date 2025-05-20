import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { fetchProducts, fetchCategories, fetchWishlist, fetchCart } from '../../http/productAPI';
import ProductCard from '../../components/ProductCard/ProductCard';
import { CATALOG_ROUTE, HOMEPAGE_ROUTE } from '../../utils/path';
import './Catalog.css'
import { Context } from '../..';

const Catalog = () => {
  const { user } = useContext(Context)
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryPath, setCategoryPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (user?.isAuth) {
      fetchWishlist().then(items => {
        setWishlistIds(items.rows.map(item => item.productId));
      }).catch(() => setWishlistIds([]));
    } else {
      setWishlistIds([]);
    }
  }, [user]);

  useEffect(() => {
    if (user?.isAuth) {
      fetchCart().then(data => {
        setCartItems(data?.cart_items || []);
      }).catch(() => setCartItems([]));
    } else {
      setCartItems([]);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadProductsAndCategory = async () => {
      try {
        const [productData, allCategories] = await Promise.all([
          fetchProducts({ categoryId }),
          fetchCategories(),
        ]);

        const products = productData.rows || [];
        if (Array.isArray(products)) {
          const sortedProducts = [...products]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .sort((a, b) => (b.quantity > 0 ? 1 : -1) - (a.quantity > 0 ? 1 : -1));
          setProducts(sortedProducts);
        } else {
          setError('Щось пішло не так з товарами.');
        }

        const buildCategoryPath = (id, categories, path = []) => {
          const category = categories.find((cat) => String(cat.id) === String(id));
          if (!category) return path;
          path.unshift({ id: category.id, name: category.name });
          if (category.parentId) {
            return buildCategoryPath(category.parentId, categories, path);
          }
          return path;
        };

        const path = buildCategoryPath(categoryId, allCategories);
        setCategoryPath(path);
      } catch (err) {
        setError('Помилка при завантаженні даних');
      } finally {
        setLoading(false);
      }
    };

    loadProductsAndCategory();
  }, [categoryId]);

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>{error}</div>;

  const lastCategory = categoryPath[categoryPath.length - 1];

  return (
    <div className="container-xxl py-4">
      <p className="mb-2 catalog-current-category">{lastCategory?.name}</p>
      <div className="mb-4">
        <span className='catalog-breadcrumbs'><Link to={HOMEPAGE_ROUTE}>ExoWorld</Link>{' > '}</span>
        {categoryPath.map((cat, index) => {
          const isLast = index === categoryPath.length - 1;
          return (
            <span key={cat.id} className='catalog-breadcrumbs'>
              {isLast ? (
                <span className='catalog-breadcrumbs-disabled'>{cat.name}</span>
              ) : (
                <Link to={`${CATALOG_ROUTE}/${cat.id}`}>{cat.name}</Link>
              )}
              {index < categoryPath.length - 1 && ' > '}
            </span>
          );
        })}
      </div>

      <div className="row row-cols-1 row-cols-xxl-5 row-cols-xl-4 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 g-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} wishlistIds={wishlistIds} cartItems={cartItems} />
          ))
        ) : (
          <p>На жаль, дана категорія не містить товарів.</p>
        )}
      </div>
    </div>
  );
};

export default Catalog;
