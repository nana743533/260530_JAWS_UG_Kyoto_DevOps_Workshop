import { Button } from '../common/Button';
import { formatPrice } from '../../utils/formatters';
import './CartItem.css';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-image">{item.image}</div>
      
      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-price">{formatPrice(item.price)} × {item.quantity}</p>
      </div>
      
      <div className="cart-item-actions">
        <div className="quantity-control">
          <button onClick={handleDecrease} disabled={item.quantity <= 1}>
            −
          </button>
          <span>{item.quantity}</span>
          <button onClick={handleIncrease}>
            +
          </button>
        </div>
        
        <div className="cart-item-subtotal">{formatPrice(subtotal)}</div>
        
        <Button variant="danger" onClick={() => onRemove(item.id)}>
          削除
        </Button>
      </div>
    </div>
  );
};
