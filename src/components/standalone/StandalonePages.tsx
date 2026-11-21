import CartPage from './CartPage'
import LivechatPage from './LivechatPage'
import NotificationPage from './NotificationPage'
import StandaloneLayout from './StandaloneLayout'

type StandaloneRoute = 'cart' | 'notification' | 'livechat'

type StandalonePagesProps = {
  route: StandaloneRoute
}

const standalonePageConfig = {
  cart: { title: 'Cart', Page: CartPage },
  notification: { title: 'Notification', Page: NotificationPage },
  livechat: { title: 'Livechat', Page: LivechatPage },
} satisfies Record<StandaloneRoute, { title: string; Page: () => JSX.Element }>

export default function StandalonePages({ route }: StandalonePagesProps) {
  const { title, Page } = standalonePageConfig[route]

  return (
    <StandaloneLayout title={title}>
      <Page />
    </StandaloneLayout>
  )
}
