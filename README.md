# Ninja Store - Firebase

Loja digital com tema dark neon cyberpunk, integração com Mercado Pago e entrega automática de produtos digitais.

## Tecnologias

- React 18
- Firebase (Hosting, Firestore, Storage, Authentication, Functions)
- Vite
- Mercado Pago API

## Configuração

### 1. Criar projeto no Firebase Console

1. Acesse https://console.firebase.google.com/
2. Crie um novo projeto chamado "Ninja Store"
3. Ative os seguintes serviços:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
   - Functions

### 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env` e preencha com suas credenciais:

```bash
cp .env.example .env
```

Obtenha as credenciais do Firebase:
- Vá em Project Settings > General
- Em "Your apps", adicione um Web App
- Copie as configurações para o `.env`

### 3. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 4. Fazer login no Firebase

```bash
firebase login
```

### 5. Inicializar projeto Firebase

```bash
firebase init
```

Selecione:
- Hosting
- Firestore
- Storage
- Functions

### 6. Instalar dependências

```bash
pnpm install
```

### 7. Configurar Mercado Pago

1. Crie uma conta no Mercado Pago Developers
2. Obtenha seu Access Token
3. Adicione ao `.env`: `MERCADO_PAGO_ACCESS_TOKEN`

### 8. Deploy

```bash
# Build do projeto
pnpm build

# Deploy completo
firebase deploy
```

Ou deploy apenas do hosting:

```bash
firebase deploy --only hosting
```

## Estrutura do Firestore

### Collection: users
```
{
  email: string,
  isAdmin: boolean,
  createdAt: timestamp
}
```

### Collection: products
```
{
  name: string,
  description: string,
  price: number,
  imageUrl: string,
  fileUrl: string,
  active: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Collection: orders
```
{
  userId: string,
  productId: string,
  productName: string,
  price: number,
  status: 'pending' | 'approved' | 'rejected',
  mercadoPagoId: string (opcional),
  createdAt: timestamp
}
```

## Criar primeiro admin

Após criar sua conta no site, acesse o Firestore no console e edite manualmente seu documento em `users`, alterando `isAdmin` para `true`.

## Funcionalidades

- ✅ Tema dark neon cyberpunk responsivo
- ✅ Autenticação com Firebase Auth
- ✅ Gerenciamento de produtos (Admin)
- ✅ Upload de imagens e arquivos para Firebase Storage
- ✅ Integração com Mercado Pago
- ✅ Painel "Meus Pedidos" com download automático
- ✅ Verificação de pagamento em tempo real
- ✅ Design responsivo (Desktop, Mobile, iOS)

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
