# 🔐 Guia de Integração Firebase com SignUp

## 📋 O que foi feito

Integrei completamente o Firebase Authentication no seu projeto de signup com email e senha. Aqui está o passo a passo:

---

## 1️⃣ Instalação do Firebase

```bash
npm install firebase
```

✅ **Já instalado no seu projeto**

---

## 2️⃣ Configuração das Credenciais

### 📝 Configurar variáveis de ambiente (`.env.local`)

**Arquivo criado:** `c:\Users\hildo\Documents\front-end\.env.local`

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain_aqui
VITE_FIREBASE_PROJECT_ID=seu_project_id_aqui
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id_aqui
VITE_FIREBASE_APP_ID=seu_app_id_aqui
```

### 🔑 Como obter essas credenciais:

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Clique em "Configurações do Projeto" (engrenagem)
4. Na aba "Geral", vá até "Seus aplicativos"
5. Clique em "Registre um novo aplicativo" e escolha "Web"
6. Copie o objeto `firebaseConfig` que aparece
7. Preencha o `.env.local` com as credenciais

---

## 3️⃣ Arquivos Criados/Modificados

### 📁 `src/lib/firebase.ts` (NOVO)
Inicializa o Firebase com suas credenciais

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
```

### 📁 `src/lib/useAuth.ts` (NOVO)
Hook customizado para gerenciar autenticação

```typescript
import { useAuth } from '@/lib/useAuth';

// Uso:
const { signup, login, logout, loading, error, user } = useAuth();

// Signup
await signup({ email: 'user@example.com', password: 'password123' });

// Login
await login({ email: 'user@example.com', password: 'password123' });

// Logout
await logout();
```

**Funcionalidades:**
- ✅ Registrar novo usuário (`signup`)
- ✅ Fazer login (`login`)
- ✅ Fazer logout (`logout`)
- ✅ Estados: `loading`, `error`, `user`
- ✅ Tratamento de erros em português

### 📝 `src/pages/SignUp/SignUp.tsx` (MODIFICADO)
Componente atualizado com integração Firebase

**Principais mudanças:**
- Importa o hook `useAuth`
- Chama `signup()` ao submeter o formulário
- Exibe mensagens de erro e sucesso
- Estado de carregamento no botão
- Validação de campos mantida

---

## 4️⃣ Como Usar

### Exemplo básico de signup:

```typescript
import { useAuth } from '@/lib/useAuth';

const MyComponent = () => {
  const { signup, loading, error } = useAuth();

  const handleSignup = async () => {
    try {
      const user = await signup({
        email: 'novo@example.com',
        password: 'Senha123!',
      });
      console.log('Usuário criado:', user);
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  return (
    <div>
      {error && <p>Erro: {error.message}</p>}
      <button onClick={handleSignup} disabled={loading}>
        {loading ? 'Carregando...' : 'Cadastrar'}
      </button>
    </div>
  );
};
```

---

## 5️⃣ Mensagens de Erro em Português

O hook traduz automaticamente os erros do Firebase:

| Código Firebase | Mensagem Exibida |
|---|---|
| `auth/invalid-email` | Email inválido |
| `auth/user-disabled` | Usuário desabilitado |
| `auth/user-not-found` | Usuário não encontrado |
| `auth/wrong-password` | Senha incorreta |
| `auth/email-already-in-use` | Email já está em uso |
| `auth/weak-password` | Senha muito fraca |
| `auth/network-request-failed` | Erro de conexão |

---

## 6️⃣ Segurança

✅ **Variáveis de ambiente protegidas:**
- `.env.local` foi adicionado ao `.gitignore`
- Credenciais não são expostas no Git
- Chaves são carregadas apenas no tempo de execução

---

## 7️⃣ Próximos Passos

### Habilitar Email/Senha no Firebase Console:

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá para **Authentication** → **Metodo de Login**
4. Clique em **Email/Senha**
5. Ative a opção "Email/Senha"
6. Salve

### Verificação de Email (Opcional):

```typescript
import { sendEmailVerification } from 'firebase/auth';

await signup({ email, password });
await sendEmailVerification(auth.currentUser);
```

### Recuperação de Senha (Opcional):

```typescript
import { sendPasswordResetEmail } from 'firebase/auth';

await sendPasswordResetEmail(auth, email);
```

---

## 📚 Referências

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Authentication Best Practices](https://firebase.google.com/docs/auth/security-best-practices)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)

---

## ✅ Checklist de Setup

- [ ] Preencher `.env.local` com credenciais do Firebase
- [ ] Habilitar "Email/Senha" no Firebase Console
- [ ] Testar signup no navegador
- [ ] Testar visualização de usuários no Firebase Console
- [ ] Implementar verificação de email (opcional)
- [ ] Implementar recuperação de senha (opcional)
- [ ] Configurar redirect após login bem-sucedido

---

## 🐛 Troubleshooting

**Erro: "auth/network-request-failed"**
- Verifique a conexão com a internet
- Verifique se as credenciais estão corretas

**Erro: "auth/weak-password"**
- Senha deve ter no mínimo 6 caracteres

**Erro: "auth/email-already-in-use"**
- O email já foi registrado
- Implemente login para usuários existentes

**Variáveis de ambiente não carregam**
- Reinicie o servidor (dev)
- Verifique se o arquivo `.env.local` existe na raiz do projeto
- Use `import.meta.env` (Vite) em vez de `process.env`

