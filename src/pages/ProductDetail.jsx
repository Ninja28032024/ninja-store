import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const productDoc = await getDoc(doc(db, 'products', id));
      if (productDoc.exists()) {
        setProduct({ id: productDoc.id, ...productDoc.data() });
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setPurchasing(true);
    try {
      // Criar pedido no Firestore
      const orderRef = await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        productId: product.id,
        productName: product.name,
        price: product.price,
        status: 'pending',
        createdAt: new Date()
      });

      // Chamar Cloud Function para criar preferência do Mercado Pago
      const response = await axios.post(
        `${import.meta.env.VITE_FIREBASE_FUNCTIONS_URL}/createCheckout`,
        {
          orderId: orderRef.id,
          productName: product.name,
          price: product.price,
          userEmail: user.email
        }
      );

      // Redirecionar para Mercado Pago
      window.location.href = response.data.init_point;
    } catch (error) {
      console.error('Erro ao processar compra:', error);
      alert('Erro ao processar compra. Tente novamente.');
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail">
          <div className="product-detail-image">
            <img src={product.imageUrl || 'https://via.placeholder.com/600x400?text=Produto'} alt={product.name} />
          </div>
          
          <div className="product-detail-info">
            <h1 className="product-detail-title">{product.name}</h1>
            <p className="product-detail-description">{product.description}</p>
            
            <div className="product-detail-price">
              R$ {product.price.toFixed(2)}
            </div>

            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="btn btn-primary btn-purchase"
            >
              {purchasing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Processando...
                </>
              ) : (
                <>
                  <i className="fas fa-shopping-cart"></i> Comprar Agora
                </>
              )}
            </button>

            <div className="product-detail-features">
              <div className="feature">
                <i className="fas fa-download"></i>
                <span>Download Instantâneo</span>
              </div>
              <div className="feature">
                <i className="fas fa-shield-alt"></i>
                <span>Pagamento Seguro</span>
              </div>
              <div className="feature">
                <i className="fas fa-headset"></i>
                <span>Suporte 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
