import { ProductCard } from './ProductCard';
import './ProductGrid.css';

export const ProductGrid = ({ products, onAddToCart, onProductClick }) => {
  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
        商品が見つかりませんでした
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
};
