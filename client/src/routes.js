import OrdersManagement from './pages/OrdersManagement/OrdersManagement'
import ProductsManagement from './pages/ProductsManagement/ProductsManagement'
import CreateProduct from './pages/ProductsManagement/CreateProduct'
import EditProduct from './pages/ProductsManagement/EditProduct'
import PostsManagement from './pages/PostsManagement/PostsManagement'
import CreatePost from './pages/PostsManagement/CreatePost'
import EditPost from './pages/PostsManagement/EditPost'
import CategoriesManagement from './pages/CategoriesManagement/CategoriesManagement'
import Wishlist from './pages/Wishlist/Wishlist';
import Bookmarks from './pages/Bookmarks/Bookmarks';
import HomePage from './pages/HomePage';
import Blog from './pages/Blog/Blog';
import OrderPage from './pages/OrderPage/OrderPage';
import Catalog from './pages/Catalog/Catalog';
import PostPage from './pages/PostPage/PostPage';
import ProductPage from './pages/ProductPage/ProductPage';
import UserProfile from './pages/UserProfile/UserProfile';
import * as path from '../src/utils/path'

export const authRoutes = [
    {   path: path.ORDERS_MANAGEMENT_ROUTE,
        Component: OrdersManagement
    },
    {   path: path.PRODUCTS_MANAGEMENT_ROUTE,
        Component: ProductsManagement
    },
    {   path: path.EDIT_PRODUCT_ROUTE + '/:id',
        Component: EditProduct
    },
    {   path: path.CREATE_PRODUCT_ROUTE,
        Component: CreateProduct
    },
    {   path: path.CATEGORIES_MANAGEMENT_ROUTE,
        Component: CategoriesManagement
    },
    {   path: path.POSTS_MANAGEMENT_ROUTE,
        Component: PostsManagement
    },
    {   path: path.EDIT_POST_ROUTE + '/:id',
        Component: EditPost
    },
    {   path: path.CREATE_POST_ROUTE,
        Component: CreatePost
    },
    {
        path: path.WISHLIST_ROUTE,
        Component: Wishlist
    },
    {
        path: path.BOOKMARKS_ROUTE,
        Component: Bookmarks
    },
    {
        path: path.PROFILE_ROUTE,
        Component: UserProfile
    }
]
export const publicRoutes = [

    {
        path: path.HOMEPAGE_ROUTE,
        Component: HomePage
    },
    {
        path: path.CATALOG_ROUTE + '/:categoryId',
        Component: Catalog
    },
    {
        path: path.PRODUCT_ROUTE + '/:id',
        Component: ProductPage
    },
    {
        path: path.BLOG_ROUTE,
        Component: Blog
    },
    {
        path: path.ORDER_ROUTE,
        Component: OrderPage
    },
    {
        path: path.POST_ROUTE + '/:id',
        Component: PostPage
    },

]