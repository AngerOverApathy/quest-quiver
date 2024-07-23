import React from 'react';
import Inventory from '../../components/Inventory/Inventory'
import Navbar from '../../components/Navbar/Navbar'
import './index.css'

function HomePage() {
  return (
    <div className="homepage-container">
      <h1>Welcome to Dimensional Depot</h1>
      <Navbar />
      <Inventory />
    </div>
  );
}

export default HomePage;