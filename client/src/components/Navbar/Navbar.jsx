import './Navbar.css';
import { Link } from 'react-router-dom';
import { HOMEPAGE_ROUTE, WISHLIST_ROUTE, PROFILE_ROUTE, BLOG_ROUTE, BOOKMARKS_ROUTE, CATALOG_ROUTE } from '../../utils/path';
import { useContext, useState, useEffect, useRef } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import AuthForm from '../AuthForm/AuthForm';
import { fetchCategories } from '../../http/productAPI';
import CartModal from '../CartModal/CartModal';

// const CategoryItem = ({ category }) => {
//     return (
//         <div className="nav-category-wrapper">
//             <Link to={`${CATALOG_ROUTE}/${category.id}`} className="header-cat">
//                 {category.name}
//             </Link>
//             {category.subcategories.length > 0 && (
//                 <div className="nav-subcategories">
//                     {category.subcategories.map(sub => (
//                         <CategoryItem key={sub.id} category={sub} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };
const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
};

const MegaMenu = ({ category }) => {
    const columns = chunkArray(category.subcategories, Math.ceil(category.subcategories.length / 4));

    return (
        <div className="mega-menu-container">
            <div className="mega-menu-wrapper container-xxl">
                <div className="mega-menu limited-columns">
                    {columns.map((group, colIdx) => (
                        <div className="mega-menu-group" key={colIdx}>
                            {group.map(sub => (
                                <div key={sub.id}>
                                    <Link to={`${CATALOG_ROUTE}/${sub.id}`} className="mega-menu-title">
                                        {sub.name}
                                    </Link>
                                    {sub.subcategories?.length > 0 && (
                                        <div className="mega-menu-sublist">
                                            {sub.subcategories.map(child => (
                                                <Link
                                                    key={child.id}
                                                    to={`${CATALOG_ROUTE}/${child.id}`}
                                                    className="mega-menu-subitem"
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Navbar = observer(({ isHomePage }) => {
    const { user } = useContext(Context);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [categories, setCategories] = useState([]);

    function buildCategoryTree(categories) {
        const map = {};
        const roots = [];

        categories.forEach(cat => {
            map[cat.id] = { ...cat, subcategories: [] };
        });

        categories.forEach(cat => {
            if (cat.parentId === null) {
                roots.push(map[cat.id]);
            } else if (map[cat.parentId]) {
                map[cat.parentId].subcategories.push(map[cat.id]);
            }
        });

        return roots;
    }
    useEffect(() => {
        fetchCategories().then(data => {
            const tree = buildCategoryTree(data);
            setCategories(tree);
        });
    }, []);

    const openAuthModal = () => {
        setShowAuthModal(true);
    };
    const closeAuthModal = () => {
        setShowAuthModal(false);
    };
    const handleProtectedClick = (redirectPath) => {
        localStorage.setItem('redirectUrl', redirectPath);
        openAuthModal();
    };

    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <header className={`${isHomePage ? 'transparent-header' : 'header'}`}>
            <nav className='header-navbar d-flex container-xxl py-3 align-items-end'>
                <div className="me-auto">
                    <Link to={HOMEPAGE_ROUTE} className="d-flex align-items-center navbar-title">
                        <img src="/static/logo.png" alt="" className='navbar-logo me-2' />
                        <div className="d-flex flex-column">
                            <p className="m-0" style={{ fontWeight: '600' }}>ExoWorld</p>
                            <p className="m-0" style={{ fontSize: '13px', fontWeight: '400' }}>зоомагазин</p>
                        </div>
                    </Link>
                </div>
                <div className="position-absolute start-50 translate-middle-x">
                    <div className="d-flex flex-row align-items-end">
                        <p className='me-5 my-0'><Link to='' className="navbar-links">Про нас</Link></p>
                        <p className='me-5 my-0'><Link to={BLOG_ROUTE} className="navbar-links">Блог</Link></p>
                        <p className='my-0'><Link to='' className="navbar-links">Контакти</Link></p>
                    </div>
                </div>
                <div className="ms-auto d-flex align-items-end">
                    {user.isAuth ? (
                        <Link to={PROFILE_ROUTE} className='me-4'>
                            <img src="/static/navbar-profile.svg" alt="" />
                        </Link>
                    ) : (
                        <div className='me-4' onClick={() => handleProtectedClick(PROFILE_ROUTE)}>
                            <img src="/static/navbar-profile.svg" alt="" />
                        </div>
                    )}
                    <div className="d-flex flex-column me-4">
                        <div className="header-wishlist-count">38</div>
                        {user.isAuth ? (
                            <Link to={WISHLIST_ROUTE} className='text-center py-0'>
                                <img src="/static/navbar-wishlist.svg" alt="" />
                            </Link>
                        ) : (
                            <div className='text-center py-0' onClick={() => handleProtectedClick(WISHLIST_ROUTE)}>
                                <img src="/static/navbar-wishlist.svg" alt="" />
                            </div>
                        )}
                    </div>
                    <div className="d-flex flex-column me-4">
                        <div className="header-saving-count">12</div>
                        {user.isAuth ? (
                            <Link to={BOOKMARKS_ROUTE} className='text-center py-0'>
                                <img src="/static/navbar-saving.svg" alt="" />
                            </Link>
                        ) : (
                            <div className='text-center py-0' onClick={() => handleProtectedClick(BOOKMARKS_ROUTE)}>
                                <img src="/static/navbar-saving.svg" alt="" />
                            </div>
                        )}
                    </div>
                    <div className="d-flex flex-column">
                        <div className="header-cart-count">2</div>
                        {user.isAuth ? (
                            <img
                                src="/static/navbar-cart.svg"
                                className='text-center py-0'
                                alt=""
                                onClick={() => setIsCartOpen(true)}
                                style={{ cursor: 'pointer' }}
                            />
                        ) : (
                            <div className='me-4' onClick={() => handleProtectedClick(HOMEPAGE_ROUTE)}>
                                <img src="/static/navbar-cart.svg" alt="" />
                            </div>
                        )}

                    </div>
                </div>
            </nav>
            {/* <div className="header-cats text-uppercase d-flex flex-row justify-content-center py-1">
                {categories.map(cat => (
                    <CategoryItem key={cat.id} category={cat} />
                ))}
            </div> */}
            <div className="header-cats d-flex flex-row justify-content-center py-1">
                {categories.map(cat => (
                    <div className="nav-category-wrapper mx-4" key={cat.id}>
                        <Link to={`${CATALOG_ROUTE}/${cat.id}`} className="header-cat text-uppercase">
                            {cat.name}
                        </Link>
                        {cat.subcategories.length > 0 && (
                            <div className="mega-menu-container">
                                <MegaMenu category={cat} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            {showAuthModal && <AuthForm onClose={closeAuthModal} />}
        </header>
    );
});

export default Navbar;
