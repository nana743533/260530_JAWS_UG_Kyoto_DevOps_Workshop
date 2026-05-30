import { Button } from '../common/Button';
import { formatPrice } from '../../utils/formatters';
import './CartSummary.css';

export const CartSummary = ({ items, total, onCheckout }) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="cart-summary">
      <h2 className="cart-summary-title">注文概要</h2>
      
      <div className="cart-summary-row">
        <span>商品数</span>
        <span>{itemCount}点</span>
      </div>
      
      <div className="cart-summary-row">
        <span>小計</span>
        <span>{formatPrice(total)}</span>
      </div>
      
      <div className="cart-summary-row">
        <span>配送料</span>
        <span>無料</span>
      </div>
      
      <div className="cart-summary-total">
        <span>合計</span>
        <span className="cart-summary-total-amount">{formatPrice(total)}</span>
      </div>
      
      <Button 
        variant="primary" 
        onClick={onCheckout}
        className="cart-summary-button"
      >
        チェックアウトへ進む
      </Button>
    </div>
  );
};
