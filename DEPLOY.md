# 🚀 Guia de Deploy - Ninja Store Firebase

## ✅ Serviços já configurados no Firebase Console

- ✅ Projeto criado: `ninja-store-d9c62`
- ✅ Firebase Authentication ativado (E-mail/Senha)
- ✅ Cloud Firestore criado (modo teste)
- ✅ App Web registrado com credenciais configuradas

## 📋 Pré-requisitos

1. Node.js instalado (versão 18+)
2. Firebase CLI instalado globalmente:
   ```bash
   npm install -g firebase-tools
   ```

## 🔐 Passo 1: Login no Firebase CLI

```bash
firebase login
```

Isso abrirá seu navegador para autenticação com sua conta Google.

## 📦 Passo 2: Build do Projeto

```bash
cd ninja-store-firebase
pnpm install
pnpm build
```

O build será gerado na pasta `dist/`.

## 🚀 Passo 3: Deploy no Firebase Hosting

```bash
firebase use ninja-store-d9c62
firebase deploy --only hosting
```

## 🌐 URL do Site

Após o deploy, seu site estará disponível em:
**https://ninja-store-d9c62.web.app**

ou

**https://ninja-store-d9c62.firebaseapp.com**

## ⚙️ Configurações Adicionais

### Ativar Storage (Requer upgrade para plano Blaze)

1. Acesse: https://console.firebase.google.com/project/ninja-store-d9c62/storage
2. Clique em "Fazer upgrade do projeto"
3. Selecione o plano Blaze (pague conforme o uso)
4. Ative o Storage

### Configurar Mercado Pago

1. Obtenha suas credenciais em: https://www.mercadopago.com.br/developers
2. Adicione ao arquivo `.env`:
   ```
   VITE_MERCADO_PAGO_PUBLIC_KEY=sua_chave_publica_aqui
   ```
3. Rebuild e redeploy:
   ```bash
   pnpm build
   firebase deploy --only hosting
   ```

### Regras de Segurança do Firestore

As regras atuais estão em modo teste (acesso público por 30 dias). Para produção, atualize em:
https://console.firebase.google.com/project/ninja-store-d9c62/firestore/rules

Exemplo de regras seguras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Produtos: leitura pública, escrita apenas admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Pedidos: apenas o dono pode ler/escrever
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🔧 Troubleshooting

### Erro de autenticação
```bash
firebase logout
firebase login
```

### Build falha
```bash
rm -rf node_modules dist
pnpm install
pnpm build
```

### Deploy falha
```bash
firebase use ninja-store-d9c62
firebase deploy --only hosting --debug
```

## 📱 Testando o Site

Após o deploy, teste:
1. Cadastro de usuário
2. Login
3. Visualização de produtos
4. (Storage ativado) Upload de imagens
5. (Mercado Pago configurado) Fluxo de pagamento

## 🎨 Personalizações

- **Logo**: Edite `src/components/Header.jsx`
- **Cores**: Edite `src/index.css` (variáveis CSS)
- **Textos**: Edite `src/components/Hero.jsx`

## 📞 Suporte

- Firebase Console: https://console.firebase.google.com/project/ninja-store-d9c62
- Documentação Firebase: https://firebase.google.com/docs
- Mercado Pago Developers: https://www.mercadopago.com.br/developers

---

**Projeto criado por Manus AI** 🤖
