# Associazione Giotto 2015

Web app full-stack per medici toscani, pensata per condividere documenti di ricerca e materiali professionali in modo semplice, pubblico e sicuro.

## Stack tecnico

- **Frontend**: React + Vite + React Router
- **Backend**: Node.js + Express + Prisma
- **Database remoto**: PostgreSQL (consigliato Neon, Supabase o Railway PostgreSQL)
- **Autenticazione**: JWT + hashing password con bcrypt
- **Upload file**: Multer (PDF)

## Struttura progetto

```
associazione-giotto-2015/
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── uploads/
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

## Database schema (Prisma)

Tabelle principali:

- **User**: `id`, `nome`, `email`, `passwordHash`, `dataRegistrazione`
- **Document**: `id`, `titolo`, `categoria`, `nomeFile`, `urlFile`, `autoreUpload`, `dataUpload`

Vedi definizione completa in `backend/prisma/schema.prisma`.

## Avvio locale

1. Installa dipendenze:

```bash
npm install
```

2. Configura environment:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Inserisci una connessione **remota** PostgreSQL in `backend/.env` (`DATABASE_URL`).

4. Genera client Prisma e crea/migra schema:

```bash
npm run prisma:generate -w backend
npm run prisma:migrate -w backend -- --name init
```

5. Avvia frontend e backend:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Funzionalità implementate

- Homepage pubblica con ultimi documenti
- Ricerca live per titolo
- Filtro categoria
- Paginazione
- Download/visualizzazione documenti senza login
- Registrazione, login, logout
- Route protetta per upload
- Upload PDF con metadati su database
- Validazione input e messaggi di errore/successo
- Sicurezza base: helmet, rate-limit auth, bcrypt, JWT

## Deploy professionale

### Backend (consigliato: Render / Railway / Fly.io)

- Configura variabili ambiente (`DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`)
- Esegui migrazioni in deploy: `npm run prisma:deploy -w backend`
- Esponi URL API pubblico, es. `https://giotto-api.onrender.com/api`

### Frontend su GitHub Pages

> GitHub Pages ospita contenuti statici. Il backend **non** può risiedere su GitHub Pages.

1. Imposta in `frontend/.env`:

```bash
VITE_API_URL="https://TUO_BACKEND_PUBBLICO/api"
```

2. Configura il repo GitHub e branch principale.

3. Deploy frontend:

```bash
npm run deploy -w frontend
```

Questo comando pubblica la cartella `frontend/dist` su branch `gh-pages`.

## API principali

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/categories`
- `GET /api/documents?q=&category=&page=&pageSize=`
- `POST /api/documents` (Bearer token + multipart)
- `GET /uploads/:filename`

## Note su storage cloud (opzionale)

Per scalabilità, puoi sostituire upload locale con S3/Supabase Storage/Cloudinary e salvare `urlFile` pubblico nel DB.
