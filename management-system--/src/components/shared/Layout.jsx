import Header from './Header';
import Footer from './Footer';
import CartDrawer from "../cart/CartDrawer";

function Layout({ children }) {
  return (
    <div>
      <Header />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;