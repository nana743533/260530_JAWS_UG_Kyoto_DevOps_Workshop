import { Button } from '../common/Button';
import { formatPrice, formatDate } from '../../utils/formatters';
import './OrderConfirmation.css';

export const OrderConfirmation = ({ orderNumber, orderDetails, onContinueShopping }) => {
  return (
    <div className="order-confirmation">
      <div className="confirmation-icon">✅</div>
      
      <h1 className="confirmation-title">ご注文ありがとうございます！</h1>
      
      <p className="confirmation-message">
        ご注文が正常に完了しました。確認メールをお送りしました。
      </p>
      
      <div className="order-details">
        <div className="order-detail-row">
          <span className="order-detail-label">注文番号</span>
          <span className="order-detail-value">{orderNumber}</span>
        </div>
        
        <div className="order-detail-row">
          <span className="order-detail-label">注文日時</span>
          <span className="order-detail-value">{formatDate(orderDetails.orderDate)}</span>
        </div>
        
        <div className="order-detail-row">
          <span className="order-detail-label">合計金額</span>
          <span className="order-detail-value order-total">
            {formatPrice(orderDetails.total)}
          </span>
        </div>
      </div>
      
      <div className="shipping-info">
        <h2 className="section-title">配送先</h2>
        <p>{orderDetails.shippingInfo.name}</p>
        <p>〒{orderDetails.shippingInfo.postalCode}</p>
        <p>{orderDetails.shippingInfo.address}</p>
        <p>電話: {orderDetails.shippingInfo.phone}</p>
      </div>
      
      <div className="order-items">
        <h2 className="section-title">注文商品</h2>
        {orderDetails.items.map(item => (
          <div key={item.id} className="confirmation-item">
            <div className="confirmation-item-image">{item.image}</div>
            <div className="confirmation-item-info">
              <p className="confirmation-item-name">{item.name}</p>
              <p className="confirmation-item-details">
                {formatPrice(item.price)} × {item.quantity}
              </p>
            </div>
            <div className="confirmation-item-total">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>
      
      <Button variant="primary" onClick={onContinueShopping}>
        ショッピングを続ける
      </Button>
    </div>
  );
};
