import { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { validateShippingInfo, validatePaymentInfo } from '../../utils/validation';
import './CheckoutForm.css';

export const CheckoutForm = ({ onSubmit, onCancel }) => {
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    postalCode: '',
    address: '',
    phone: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    
    // 有効期限フィールドの特別処理
    if (name === 'expiryDate') {
      // 数字のみを抽出
      const numbers = value.replace(/\D/g, '');
      
      // MM/YY形式に自動フォーマット
      let formatted = numbers;
      if (numbers.length >= 2) {
        formatted = numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
      }
      
      setPaymentInfo(prev => ({ ...prev, [name]: formatted }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
      return;
    }
    
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const shippingErrors = validateShippingInfo(shippingInfo);
    const paymentErrors = validatePaymentInfo(paymentInfo);
    const allErrors = { ...shippingErrors, ...paymentErrors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setIsSubmitting(true);

    // デバッグ用（送信内容の確認）
    console.log('Submitting order:', shippingInfo, paymentInfo);

    try {
      await onSubmit({ shippingInfo, paymentInfo });
    } catch (error) {
      console.error('Order submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <div className="checkout-section">
        <h2 className="checkout-section-title">配送先情報</h2>
        
        <Input
          label="お名前"
          name="name"
          value={shippingInfo.name}
          onChange={handleShippingChange}
          error={errors.name}
          required
        />
        
        <Input
          label="郵便番号"
          name="postalCode"
          value={shippingInfo.postalCode}
          onChange={handleShippingChange}
          error={errors.postalCode}
          placeholder="123-4567"
          required
        />
        
        <Input
          label="住所"
          name="address"
          value={shippingInfo.address}
          onChange={handleShippingChange}
          error={errors.address}
          required
        />
        
        <Input
          label="電話番号"
          name="phone"
          type="tel"
          value={shippingInfo.phone}
          onChange={handleShippingChange}
          error={errors.phone}
          placeholder="09012345678"
          required
        />
      </div>

      <div className="checkout-section">
        <h2 className="checkout-section-title">支払い情報</h2>
        
        <Input
          label="カード番号"
          name="cardNumber"
          value={paymentInfo.cardNumber}
          onChange={handlePaymentChange}
          error={errors.cardNumber}
          placeholder="1234567890123456"
          required
        />
        
        <div className="form-row">
          <Input
            label="有効期限"
            name="expiryDate"
            value={paymentInfo.expiryDate}
            onChange={handlePaymentChange}
            error={errors.expiryDate}
            placeholder="MM/YY"
            required
          />
          
          <Input
            label="CVV"
            name="cvv"
            value={paymentInfo.cvv}
            onChange={handlePaymentChange}
            error={errors.cvv}
            placeholder="123"
            required
          />
        </div>
        
        <Input
          label="カード名義"
          name="cardHolder"
          value={paymentInfo.cardHolder}
          onChange={handlePaymentChange}
          error={errors.cardHolder}
          required
        />
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? '処理中...' : '注文を確定する'}
        </Button>
      </div>
    </form>
  );
};
