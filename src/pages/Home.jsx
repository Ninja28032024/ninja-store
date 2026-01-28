import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  // Produtos mockados para demonstração
  const mockProducts = [
    {
      id: '1',
      name: 'E-book Premium',
      description: 'Guia completo para iniciantes',
      price: 49.90,
      imageUrl: 'https://via.placeholder.com/300x200/ff00ff/ffffff?text=E-book',
      active: true
    },
    {
      id: '2',
      name: 'Template Design',
      description: 'Pack com 50 templates profissionais',
      price: 79.90,
      imageUrl: 'https://via.placeholder.com/300x200/00f3ff/ffffff?text=Templates',
      active: true
    },
    {
      id: '3',
      name: 'Curso Online',
      description: 'Acesso vitalício ao curso completo',
      price: 149.90,
      imageUrl: 'https://via.placeholder.com/300x200/39ff14/000000?text=Curso',
      active: true
    }
  ];

  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Tentar buscar do Firebase, mas usar mock como fallback
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'), where('active', '==', true));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      }
    } catch (error) {
      console.log('Usando produtos mockados para demonstração');
      // Manter produtos mockados em caso de erro
    }
  };

  return (
    <div className="home">
      <Hero />
      
      <section id="products" className="products-section">
        <div className="container">
          <h2 className="section-title">Nossos Produtos</h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : products.length === 0 ? (
            <p className="no-products">Nenhum produto disponível no momento.</p>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
