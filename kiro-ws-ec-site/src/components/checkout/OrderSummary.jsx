import { formatPrice } from '../../utils/formatters';
import './OrderSummary.css';

export const OrderSummary = ({ items, total, shippingFee = 0 }) => {
  return (
    <div className="order-summary">
      <h2 className="order-summary-title">注文内容</h2>
      
      <div className="order-items">
        {items.map(item => (
          <div key={item.id} className="order-item">
            <div className="order-item-info">
              <div className="order-item-image">{item.image}</div>
              <div className="order-item-details">
                <p className="order-item-name">{item.name}</p>
                <p className="order-item-quantity">数量: {item.quantity}</p>
              </div>
            </div>
            <div className="order-item-price">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="order-summary-row">
        <span>小計</span>
        <span>{formatPrice(total)}</span>
      </div>
      
      <div className="order-summary-row">
        <span>配送料</span>
        <span>{shippingFee > 0 ? formatPrice(shippingFee) : '無料'}</span>
      </div>
      
      <div className="order-summary-total">
        <span>合計</span>
        <span className="order-summary-total-amount">
          {formatPrice(total + shippingFee)}
        </span>
      </div>
    </div>
  );
};
