# Associazione Giotto 2015

Web app full-stack per medici toscani per condividere documenti clinici e materiali professionali con consultazione pubblica e upload riservato agli utenti autenticati.

## Stack tecnico

- **Frontend**: React + Vite + React Router
- **Backend**: Node.js + Express
- **Database online**: **Google Firebase Firestore**
- **Storage file online**: **Google Firebase Cloud Storage**
- **Auth applicativa**: JWT + hashing password con bcrypt

## Struttura progetto

```
associazione-giotto-2015/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── api/
│   │   └── styles/
│   └── vite.config.js
└── README.md
```

## Data model su Firebase (online)

### Collection `users`
- `id` (auto id documento)
- `nome`
- `email` (univoca a livello applicativo)
- `passwordHash`
- `dataRegistrazione` (timestamp)

### Collection `documents`
- `id` (auto id documento)
- `titolo`
- `categoria`
- `nomeFile`
- `urlFile` (signed URL Firebase Storage)
- `storagePath`
- `autoreUpload` (id utente)
- `autoreNome`
- `dataUpload` (timestamp)

## Setup Firebase

1. Crea progetto Firebase.
2. Abilita **Firestore Database** (production mode) e **Cloud Storage**.
3. Crea un **Service Account** e scarica le credenziali.
4. Copia `.env`:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

5. Inserisci i valori Firebase in `backend/.env`:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (con `\n` escaped)
- `FIREBASE_STORAGE_BUCKET`

## Avvio locale

```bash
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Funzionalità

- Homepage pubblica con ultimi documenti
- Ricerca per titolo
- Filtri per categoria
- Paginazione
- Visualizzazione/download senza login
- Registrazione/login/logout
- Upload PDF solo per utenti autenticati
- Validazione input e feedback utente
- Sicurezza base: helmet, rate-limit, bcrypt, JWT

## API principali

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/categories`
- `GET /api/documents?q=&category=&page=&pageSize=`
- `POST /api/documents` (Bearer token + multipart)

## Deploy

### Backend
Deploy su Render / Railway / Fly.io / Cloud Run con variabili `.env` impostate.

### Frontend su GitHub Pages

1. Imposta `VITE_API_URL` verso backend deployato, esempio:
```bash
VITE_API_URL="https://giotto-api.onrender.com/api"
```
2. Esegui:
```bash
npm run deploy -w frontend
```
