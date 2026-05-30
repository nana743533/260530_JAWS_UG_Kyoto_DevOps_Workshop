import { Button } from '../common/Button';
import './EmptyCart.css';

export const EmptyCart = ({ onContinueShopping }) => {
  return (
    <div className="empty-cart">
      <div className="empty-cart-icon">🛒</div>
      <h2 className="empty-cart-title">カートは空です</h2>
      <p className="empty-cart-message">
        商品を追加して、ショッピングを始めましょう
      </p>
      <Button variant="primary" onClick={onContinueShopping}>
        商品一覧へ戻る
      </Button>
    </div>
  );
};
