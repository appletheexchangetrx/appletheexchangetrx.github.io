import EmptyState from '../common/EmptyState'
export default function NotificationPage(){
 return <section className="notification-page"><header><span className="storefront-kicker">UPDATES</span><h1>Notifications</h1><p>Store and order updates for this device.</p></header><EmptyState title="You're all caught up" description="There are no notifications stored in this browser. Push notifications and account-wide sync are not connected."/></section>
}