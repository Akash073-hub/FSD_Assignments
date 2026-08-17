import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <h1>Welcome to Our Store</h1>
        <p>Browse our amazing collection of products</p>
        
        <div className="home-buttons">
          <Link to="/items" className="home-btn btn-primary">
            Shop Now
          </Link>
          <Link to="/cart" className="home-btn btn-secondary">
            View Cart
          </Link>
        </div>

        <div className="features">
          <div className="feature-card">
            <h3>📦 Quality Products</h3>
            <p>Choose from a wide variety of quality items</p>
          </div>
          <div className="feature-card">
            <h3>🛒 Easy Shopping</h3>
            <p>Add and remove items with just one click</p>
          </div>
          <div className="feature-card">
            <h3>💰 Best Prices</h3>
            <p>Get the best deals on all products</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
