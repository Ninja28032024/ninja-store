import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import './MyOrders.css';

const MyOrders = ({ user }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const ordersData = await Promise.all(
        querySnapshot.docs.map(async (orderDoc) => {
          const orderData = orderDoc.data();
          
          // Buscar dados do produto
          const productDoc = await getDoc(doc(db, 'products', orderData.productId));
          const productData = productDoc.exists() ? productDoc.data() : {};
          
          return {
            id: orderDoc.id,
            ...orderData,
            product: productData
          };
        })
      );
      
      setOrders(ordersData.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (order) => {
    try {
      if (!order.product.fileUrl) {
        alert('Arquivo não disponível');
        return;
      }

      // Gerar URL de download do Firebase Storage
      const fileRef = ref(storage, order.product.fileUrl);
      const downloadUrl = await getDownloadURL(fileRef);
      
      // Abrir em nova aba para download
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      alert('Erro ao fazer download. Tente novamente.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pendente', class: 'status-pending' },
      approved: { text: 'Aprovado', class: 'status-approved' },
      rejected: { text: 'Rejeitado', class: 'status-rejected' }
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="container">
        <h1 className="page-title">Meus Pedidos</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <i className="fas fa-shopping-bag"></i>
            <p>Você ainda não fez nenhuma compra.</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Ver Produtos
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const statusBadge = getStatusBadge(order.status);
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>{order.productName}</h3>
                      <p className="order-date">
                        {order.createdAt?.toDate().toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className={`status-badge ${statusBadge.class}`}>
                      {statusBadge.text}
                    </span>
                  </div>

                  <div className="order-body">
                    <div className="order-price">
                      R$ {order.price.toFixed(2)}
                    </div>

                    {order.status === 'approved' && (
                      <button
                        onClick={() => handleDownload(order)}
                        className="btn btn-primary btn-download"
                      >
                        <i className="fas fa-download"></i> Baixar Arquivo
                      </button>
                    )}

                    {order.status === 'pending' && (
                      <p className="order-message">
                        Aguardando confirmação do pagamento...
                      </p>
                    )}

                    {order.status === 'rejected' && (
                      <p className="order-message error">
                        Pagamento não aprovado. Entre em contato com o suporte.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
