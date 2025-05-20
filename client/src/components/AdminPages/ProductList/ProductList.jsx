import React, { useEffect, useState } from 'react';
import './ProductList.css';
import { useNavigate } from "react-router-dom";
import { EDIT_PRODUCT_ROUTE } from '../../../utils/path';
import { fetchProducts } from '../../../http/productAPI';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 12;
    const navigate = useNavigate();

    const loadProducts = async (currentPage) => {
        const data = await fetchProducts({ limit, page: currentPage });
        if (data.rows.length < limit) {
            setHasMore(false);
        }
        if (currentPage === 1) {
            setProducts(data.rows);
        } else {
            setProducts(prev => [...prev, ...data.rows]);
        }
    };

    useEffect(() => {
        loadProducts(1);
    }, []);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadProducts(nextPage);
    };

    return (
        <div className='my-4'>
            <table className='product-list-table'>
                <thead>
                    <tr className='product-list-thead'>
                        <td>Фото</td>
                        <td>Код товару</td>
                        <td>Назва</td>
                        <td>Кількість на складі</td>
                        <td>Ціна</td>
                        <td>Ціна зі знижкою</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>
                                <img
                                    className='product-list-img'
                                    src={product.images?.find(img => img.isPreview)?.img}
                                    alt="product"
                                />
                            </td>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.quantity} шт.</td>
                            <td>{product.price} грн.</td>
                            <td>{product.disc_price} грн.</td>
                            <td>
                                <img
                                    src="/static/edit-icon.svg"
                                    className='product-edit-icon'
                                    alt="edit"
                                    onClick={() => navigate(`${EDIT_PRODUCT_ROUTE}/${product.id}`)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {hasMore && (
                <div className='text-center my-4'>
                    <button onClick={loadMore} className='btn btn-primary'>Показати ще</button>
                </div>
            )}
        </div>
    );
};

export default ProductList;
