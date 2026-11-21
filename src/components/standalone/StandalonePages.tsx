import CartPage from './CartPage'
import LivechatPage from './LivechatPage'
import NotificationPage from './NotificationPage'
import StandaloneLayout from './StandaloneLayout'

type StandaloneRoute = 'cart' | 'notification' | 'livechat'

type StandalonePagesProps = {
  route: StandaloneRoute
  onBack: () => void
}

const standalonePageConfig = {
  cart: { title: 'Cart', Page: CartPage },
  notification: { title: 'Notification', Page: NotificationPage },
  livechat: { title: 'Livechat', Page: LivechatPage },
} as const

export default function StandalonePages({ route, onBack }: StandalonePagesProps) {
  const { title, Page } = standalonePageConfig[route]

  return (
    <StandaloneLayout title={title} onBack={onBack}>
      <Page />
    </StandaloneLayout>
  )
}
