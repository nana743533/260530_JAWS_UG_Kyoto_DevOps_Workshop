import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Header.css';

export const Header = () => {
  const { cartCount } = useCart();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          🛍️ ECサイト
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">
            ホーム
          </Link>
          <Link to="/cart" className="cart-link">
            🛒 カート
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
};
