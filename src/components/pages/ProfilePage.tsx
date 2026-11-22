import { readOrders } from '../../services/orderStorage'
import { useWishlist } from '../../context/WishlistContext'
import EmptyState from '../common/EmptyState'
export default function ProfilePage(){
 const {ids}=useWishlist()
 const orders=readOrders()
 return <section className="profile-page">
  <header className="profile-hero"><span className="profile-avatar" aria-hidden="true">A</span><div><span className="storefront-kicker">YOUR ACCOUNT</span><h1>Welcome</h1><p>Guest profile · This device only</p></div></header>
  <div className="profile-summary"><a href="#/orders"><strong>{orders.length}</strong><span>Orders</span></a><div><strong>{ids.length}</strong><span>Wishlist</span></div></div>
  <section className="profile-links"><a href="#/orders">Order history <span>→</span></a><a href="#/notification">Notifications <span>→</span></a><a href="#/livechat">Contact support <span>→</span></a></section>
  <p className="profile-note">Sign-in, account sync, and profile editing are not connected in this frontend-only version.</p>
  {orders.length===0&&<EmptyState title="Your order history is empty" description="Orders saved in this browser will appear here."/>}
 </section>
}