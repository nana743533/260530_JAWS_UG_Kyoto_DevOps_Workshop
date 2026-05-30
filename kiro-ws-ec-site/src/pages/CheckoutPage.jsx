import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { generateOrderNumber } from '../utils/formatters';
import './CheckoutPage.css';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async ({ shippingInfo, paymentInfo }) => {
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const orderNumber = generateOrderNumber();
    const orderDetails = {
      orderNumber,
      items: cart,
      subtotal: cartTotal,
      shippingFee: 0,
      total: cartTotal,
      shippingInfo,
      paymentInfo,
      orderDate: new Date(),
      status: 'confirmed'
    };

    clearCart();
    navigate(`/order-confirmation/${orderNumber}`, { state: { orderDetails } });
  };

  const handleCancel = () => {
    navigate('/cart');
  };

  return (
    <div className="checkout-page">
      <h1 className="page-title">チェックアウト</h1>
      
      <div className="checkout-content">
        <div className="checkout-form-section">
          <CheckoutForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
        
        <div className="checkout-summary-section">
          <OrderSummary items={cart} total={cartTotal} />
        </div>
      </div>
    </div>
  );
};
