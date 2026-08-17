import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { CartProvider, CartContext } from './CartContext';
import Home from './Home';
import Items from './Items';
import Cart from './Cart';

function Navigation() {
  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🛍️ Store
        </Link>
        <ul className="nav-links">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/items" className="nav-link">Shop</Link></li>
          <li>
            <Link to="/cart" className="nav-link cart-link">
              🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <>
      <Navigation />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<Items />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>&copy; 2024 Our Store. All rights reserved.</p>
      </footer>
    </>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </Router>
  );
}

export default App;
