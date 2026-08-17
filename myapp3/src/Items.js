import React, { useContext } from 'react';
import { CartContext } from './CartContext';

const Items = () => {
  const { addToCart, cart } = useContext(CartContext);

  const products = [
    {
      id: 1,
      name: 'Laptop',
      price: 999.99,
      description: 'High-performance laptop for work and gaming',
      image: '💻'
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      price: 29.99,
      description: 'Ergonomic wireless mouse with precision tracking',
      image: '🖱️'
    },
    {
      id: 3,
      name: 'Mechanical Keyboard',
      price: 89.99,
      description: 'RGB mechanical keyboard with cherry switches',
      image: '⌨️'
    },
    {
      id: 4,
      name: 'Monitor',
      price: 299.99,
      description: '27-inch 4K monitor for stunning visuals',
      image: '🖥️'
    },
    {
      id: 5,
      name: 'USB-C Hub',
      price: 49.99,
      description: 'Multi-port USB-C hub with charging support',
      image: '🔌'
    },
    {
      id: 6,
      name: 'Headphones',
      price: 149.99,
      description: 'Noise-cancelling wireless headphones',
      image: '🎧'
    },
    {
      id: 7,
      name: 'Phone Stand',
      price: 19.99,
      description: 'Adjustable phone stand for any device',
      image: '📱'
    },
    {
      id: 8,
      name: 'Webcam',
      price: 79.99,
      description: '1080p HD webcam with built-in microphone',
      image: '📹'
    }
  ];

  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  return (
    <div className="items">
      <div className="items-header">
        <h1>Shop Items</h1>
        <p>Choose your favorite products</p>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">{product.image}</div>
            <h3>{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <div className="product-price">${product.price}</div>
            <button
              className={`add-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
              onClick={() => addToCart(product)}
            >
              {isInCart(product.id) ? '✓ In Cart' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Items;
