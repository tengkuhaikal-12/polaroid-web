import PhotoEditorController from './PhotoEditorController'
import AuthController from './AuthController'
import CartController from './CartController'
import OrderController from './OrderController'
import PaymentController from './PaymentController'
import StudioController from './StudioController'
import ProductController from './ProductController'
import Seller from './Seller'
const Controllers = {
    PhotoEditorController: Object.assign(PhotoEditorController, PhotoEditorController),
AuthController: Object.assign(AuthController, AuthController),
CartController: Object.assign(CartController, CartController),
OrderController: Object.assign(OrderController, OrderController),
PaymentController: Object.assign(PaymentController, PaymentController),
StudioController: Object.assign(StudioController, StudioController),
ProductController: Object.assign(ProductController, ProductController),
Seller: Object.assign(Seller, Seller),
}

export default Controllers