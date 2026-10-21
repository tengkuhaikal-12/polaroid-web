import studioOrders from './studio-orders'
import seller from './seller'
const sellerNamespace = {
    studioOrders: Object.assign(studioOrders, studioOrders),
seller: Object.assign(seller, seller),
}

export default sellerNamespace