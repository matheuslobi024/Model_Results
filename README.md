# Model Results – Financial Analysis & Technology

Plataforma corporativa de valoração financeira, análise de viabilidade e projeção de cenários para novos negócios.

---

## 🚀 Como Executar o Projeto

### 1. Modo Desenvolvimento (`npm run dev`)
Para abrir a plataforma em modo de desenvolvimento (abertura direta no Dashboard com acesso imediato a todas as telas para testes rápidos):
```bash
npm install
npm run dev
```
Acesse: `http://localhost:5173`

---

### 2. Modo Usuário / Produção (`npm start` ou sem `dev`)
Para rodar a aplicação exatamente como o **usuário final irá visualizar** (iniciando pela **Landing Page** e exigindo autenticação para acessar os módulos do sistema):
```bash
npm install
npm start
```
* **Credenciais do Usuário**:
  * **E-mail**: `admin@gmail.com`
  * **Senha**: `123456789`

---

### 3. Backend (API em Python / FastAPI)
Em um terminal separado:
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Acesse a API em: `http://localhost:8000` (Documentação em `http://localhost:8000/docs`).

---

## 🛠️ Publicação no Git

O repositório já inclui os arquivos `.gitignore` e `.gitattributes` configurados. Para subir este projeto para o GitHub ou GitLab, execute no terminal da pasta raiz:

```bash
git init
git add .
git commit -m "feat: initial commit - Model Results Financial Platform"
git branch -M main
git remote add origin <URL_DO_SEU_REPOSITORIO_GIT>
git push -u origin main
```
