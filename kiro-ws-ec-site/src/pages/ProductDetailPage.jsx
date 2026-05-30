import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ProductDetail } from '../components/product/ProductDetail';
import { Message } from '../components/common/Message';
import { products } from '../data/products';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [message, setMessage] = useState(null);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>商品が見つかりませんでした</h2>
        <button onClick={() => navigate('/')}>商品一覧へ戻る</button>
      </div>
    );
  }

  const handleAddToCart = (product, quantity) => {
    addToCart(product, quantity);
    setMessage({
      type: 'success',
      text: `${product.image} ${product.name}を${quantity}個カートに追加しました`
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div>
      {message && (
        <Message
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
      
      <ProductDetail
        product={product}
        onAddToCart={handleAddToCart}
        onBack={handleBack}
      />
    </div>
  );
};
