import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image">
        <img src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Produto'} alt={product.name} />
        <div className="product-overlay">
          <i className="fas fa-eye"></i>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">R$ {product.price.toFixed(2)}</span>
          <button className="btn-buy">
            <i className="fas fa-shopping-cart"></i> Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
