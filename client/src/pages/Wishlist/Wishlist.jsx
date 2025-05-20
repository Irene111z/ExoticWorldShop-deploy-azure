import React, { useState, useContext, useEffect } from 'react'
import './Wishlist.css'
import ProductCard from '../../components/ProductCard/ProductCard';
import { Context } from '../..';
import { fetchProductsByIds, fetchWishlist } from '../../http/productAPI';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const { user } = useContext(Context)

  useEffect(() => {
    if (user?.isAuth) {
      fetchWishlist()
        .then(items => {
          const ids = items.rows.map(item => item.productId);
          setWishlistIds(ids);

          if (ids.length > 0) {
            fetchProductsByIds(ids).then(setProducts);
          } else {
            setProducts([]);
          }
        })
        .catch(() => {
          setWishlistIds([]);
          setProducts([]);
        });
    } else {
      setWishlistIds([]);
      setProducts([]);
    }
  }, [user]);

  const handleRemoveFromWishlist = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  return (
    <div className='container-xxl container-fluid'>
      <p className='mt-3 mb-0 wishlist-title'>Хочу це!</p>
      <p className='wishlist-subtitle'>Список бажаних товарів</p>
      <div className="row row-cols-1 row-cols-xxl-5 row-cols-xl-4 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 g-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} wishlistIds={wishlistIds} onRemoveFromWishlist={handleRemoveFromWishlist}/>
          ))
        ) : (
          <p>Ви ще не додали жодного товару в список бажань.</p>
        )}
      </div>
    </div>
  )
}

export default Wishlist