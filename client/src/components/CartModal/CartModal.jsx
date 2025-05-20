import { useState, useEffect } from 'react';
import './CartModal.css';
import { Link } from 'react-router-dom';
import { fetchCart, increaseCartItem, decreaseCartItem, deleteProductFromCart } from '../../http/productAPI'
import { PRODUCT_ROUTE, ORDER_ROUTE } from '../../utils/path';

const CartModal = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState([]);
    const totalPrice = cartItems.reduce((sum, { quantity, product }) => {
        const price = product.disc_price ? Number(product.disc_price) : Number(product.price);
        return sum + price * quantity;
    }, 0);

    useEffect(() => {
        if (isOpen) {
            fetchCart()
                .then(data => {
                    setCartItems((data.cart_items || []).sort((a, b) =>
                        a.product.name.localeCompare(b.product.name, 'uk', { sensitivity: 'base' })
                    ));
                })
                .catch(() => {
                    alert('Помилка при завантаженні кошика');
                });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('cart-modal-backdrop')) {
            onClose();
        }
    };

    const handleIncrease = async (productId) => {
        try {
            await increaseCartItem(productId);
            const data = await fetchCart();
            setCartItems((data.cart_items || []).sort((a, b) =>
                a.product.name.localeCompare(b.product.name, 'uk', { sensitivity: 'base' })
            ));
        } catch {
            alert('Не вдалося збільшити кількість товару');
        }
    };

    const handleDecrease = async (productId) => {
        try {
            await decreaseCartItem(productId);
            const data = await fetchCart();
            setCartItems((data.cart_items || []).sort((a, b) =>
                a.product.name.localeCompare(b.product.name, 'uk', { sensitivity: 'base' })
            ));
        } catch {
            alert('Не вдалося зменшити кількість товару');
        }
    };

    const handleDelete = async (productId) => {
        try {
            await deleteProductFromCart(productId);
            const data = await fetchCart();
            setCartItems((data.cart_items || []).sort((a, b) =>
                a.product.name.localeCompare(b.product.name, 'uk', { sensitivity: 'base' })
            ));
        } catch {
            alert('Не вдалося видалити товар з кошика');
        }
    };

    return (
        <div className="cart-modal-backdrop" onClick={handleBackdropClick}>
            <div className="cart-modal-content">
                <div className="cart-modal-header d-flex justify-content-between">
                    <h5>Кошик</h5>
                    <button className="cart-close-btn" onClick={onClose}><h2>×</h2></button>
                </div>
                <div className="cart-modal-body">
                    <div className='d-flex flex-column'>
                        {cartItems.length === 0 && <p>Кошик порожній</p>}
                        {cartItems.map(({ id, quantity, product }) => (
                            <div key={id} className="cart-item d-flex flex-column py-2">
                                <Link
                                    to={PRODUCT_ROUTE + '/' + product.id}
                                    onClick={onClose}
                                    className="mb-1 cart-item-name"
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    {product.name}
                                </Link>
                                <div className="d-flex py-2 align-items-center">
                                    <Link to={PRODUCT_ROUTE + '/' + product.id} onClick={onClose}><img
                                        src={product.images?.[0]?.img}
                                        className="cart-item-img me-5"
                                        alt={product.name}
                                    /></Link>
                                    <div className="d-flex justify-content-between w-100">
                                        <div className="d-flex cart-item-quantity d-flex align-items-center">
                                            <button
                                                className='cart-item-quantity-dec px-2'
                                                onClick={() => handleDecrease(product.id)}
                                                disabled={quantity <= 1}
                                            >-</button>
                                            <p className='mb-0 px-2'>{quantity}</p>
                                            <button
                                                className='cart-item-quantity-inc px-2'
                                                onClick={() => handleIncrease(product.id)}
                                                disabled={quantity >= product.quantity}
                                            >+</button>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            {product.disc_price ? (
                                                <div className="d-flex flex-column cart-item-price me-3">
                                                    <p className='cart-item-sale-price mb-0'>{(Number(product.disc_price).toFixed(2).replace(/\.00$/, '')) * quantity} грн.</p>
                                                    <p className='cart-item-old-price mb-0'>
                                                        {(Number(product.price).toFixed(2).replace(/\.00$/, '') * quantity)} грн.
                                                    </p>
                                                </div>
                                            ) :
                                                (
                                                    <p className='cart-item-sale-price mb-0 me-3'>{(Number(product.price).toFixed(2).replace(/\.00$/, '')) * quantity} грн.</p>
                                                )}
                                            <img src="/static/delete-icon.svg" className="delete-cart-item-btn me-2" alt="" onClick={() => handleDelete(product.id)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="cart-modal-footer d-flex flex-column">
                    <p className='text-end'>Усього товарів на суму: {totalPrice.toFixed(2).replace(/\.00$/, '')} грн.</p>
                    <div className="d-flex">
                        <button className="btn-continue-shopping me-4" onClick={onClose}>Продовжити покупки</button>
                        <Link
                            to={ORDER_ROUTE}
                            className="btn-go-to-order-form"
                            onClick={onClose}
                        >
                            Оформити замовлення
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartModal;
