import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyCart } from '../components/cart/EmptyCart';
import './CartPage.css';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (cart.length === 0) {
    return <EmptyCart onContinueShopping={handleContinueShopping} />;
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">ショッピングカート</h1>
      
      <div className="cart-content">
        <div className="cart-items-section">
          {cart.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>
        
        <div className="cart-summary-section">
          <CartSummary
            items={cart}
            total={cartTotal}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
};
