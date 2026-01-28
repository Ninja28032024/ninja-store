import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import './Admin.css';

const Admin = ({ user }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [productFile, setProductFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = editingProduct?.imageUrl || '';
      let fileUrl = editingProduct?.fileUrl || '';

      // Upload da imagem
      if (imageFile) {
        const imageRef = ref(storage, `products/images/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Upload do arquivo do produto
      if (productFile) {
        const fileRef = ref(storage, `products/files/${Date.now()}_${productFile.name}`);
        await uploadBytes(fileRef, productFile);
        fileUrl = await getDownloadURL(fileRef);
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        active: formData.active,
        imageUrl,
        fileUrl,
        updatedAt: new Date()
      };

      if (editingProduct) {
        // Atualizar produto existente
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        // Criar novo produto
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date()
        });
      }

      // Reset form
      setFormData({ name: '', description: '', price: '', active: true });
      setImageFile(null);
      setProductFile(null);
      setEditingProduct(null);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      active: product.active
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
      await deleteDoc(doc(db, 'products', productId));
      fetchProducts();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      alert('Erro ao deletar produto.');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1 className="page-title">Painel Admin</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingProduct(null);
              setFormData({ name: '', description: '', price: '', active: true });
            }}
            className="btn btn-primary"
          >
            {showForm ? 'Cancelar' : 'Novo Produto'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="product-form">
            <h2>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
            
            <div className="form-group">
              <label>Nome do Produto</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Imagem do Produto</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              {editingProduct?.imageUrl && !imageFile && (
                <p className="file-info">Imagem atual mantida</p>
              )}
            </div>

            <div className="form-group">
              <label>Arquivo Digital</label>
              <input
                type="file"
                onChange={(e) => setProductFile(e.target.files[0])}
              />
              {editingProduct?.fileUrl && !productFile && (
                <p className="file-info">Arquivo atual mantido</p>
              )}
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                Produto ativo
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </form>
        )}

        <div className="products-table">
          <h2>Produtos Cadastrados</h2>
          {products.length === 0 ? (
            <p className="no-products">Nenhum produto cadastrado.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>R$ {product.price.toFixed(2)}</td>
                    <td>
                      <span className={`status ${product.active ? 'active' : 'inactive'}`}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="actions">
                      <button onClick={() => handleEdit(product)} className="btn-edit">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="btn-delete">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
