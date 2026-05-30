import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { OrderConfirmation } from '../components/checkout/OrderConfirmation';

export const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) {
    navigate('/');
    return null;
  }

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <OrderConfirmation
      orderNumber={orderNumber}
      orderDetails={orderDetails}
      onContinueShopping={handleContinueShopping}
    />
  );
};
