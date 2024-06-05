import React from 'react';
import Inventory from '../../components/Inventory/Inventory'

function HomePage() {
  return (
    <div className="homepage-container">
      <h1>Welcome to Quest Quiver</h1>
      <Inventory />
    </div>
  );
}

export default HomePage;