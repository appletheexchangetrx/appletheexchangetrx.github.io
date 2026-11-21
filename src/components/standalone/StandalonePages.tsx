import CartPage from './CartPage'
import CheckoutPage from './CheckoutPage'
import LivechatPage from './LivechatPage'
import NotificationPage from './NotificationPage'
import OrderDetailPage from './OrderDetailPage'
import OrdersPage from './OrdersPage'
import ProductDetailPage from './ProductDetailPage'
import StandaloneLayout from './StandaloneLayout'

type StandalonePagesProps = {
  route: string
  routeId?: string
  onBack: () => void
}

export default function StandalonePages({ route, routeId, onBack }: StandalonePagesProps) {
  const page = (() => {
    switch (route) {
      case 'cart': return { title: 'Cart', content: <CartPage /> }
      case 'notification': return { title: 'Notification', content: <NotificationPage /> }
      case 'livechat': return { title: 'Livechat', content: <LivechatPage /> }
      case 'product': return { title: 'Product details', content: <ProductDetailPage productId={routeId} /> }
      case 'checkout': return { title: 'Checkout', content: <CheckoutPage /> }
      case 'orders': return { title: 'My orders', content: <OrdersPage /> }
      case 'order': return { title: 'Order details', content: <OrderDetailPage orderId={routeId} /> }
      default: return { title: 'Page not found', content: <div className="page-placeholder"><p>This page could not be found.</p></div> }
    }
  })()

  const bottomAction = route === 'checkout'
    ? <button className="standalone-primary-action" type="button" disabled>Continue to payment</button>
    : undefined

  return (
    <StandaloneLayout title={page.title} onBack={onBack} bottomAction={bottomAction}>
      {page.content}
    </StandaloneLayout>
  )
}
