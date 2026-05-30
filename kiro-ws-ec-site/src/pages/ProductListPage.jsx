import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ProductGrid } from '../components/product/ProductGrid';
import { Message } from '../components/common/Message';
import { products } from '../data/products';
import './ProductListPage.css';

export const ProductListPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [message, setMessage] = useState(null);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setMessage({
      type: 'success',
      text: `${product.image} ${product.name}をカートに追加しました`
    });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="product-list-page">
      {message && (
        <Message
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
      
      <h1 className="page-title">商品一覧</h1>
      
      <ProductGrid
        products={products}
        onAddToCart={handleAddToCart}
        onProductClick={handleProductClick}
      />
    </div>
  );
};
