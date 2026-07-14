# SME News — Full Stack Clone

A responsive news-site interface (HTML/CSS/Bootstrap/JavaScript) with a
Node.js/Express backend, backed by MongoDB (default) or MySQL (alternative).

## Features

- Responsive layout (Bootstrap 5.3 grid, mobile nav collapse, breakpoints for phone/tablet/desktop)
- Dark mode toggle button (uses Bootstrap's native `data-bs-theme`)
- Dynamic article grid, featured section, popular sidebar, and pagination — all rendered from API data
- REST API (Node.js + Express) with CRUD endpoints for articles
- MongoDB (Mongoose) by default; MySQL alternative included

## Project structure

```
sme-news-app/
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   └── js/main.js
└── backend/
    ├── server.js              # MongoDB entry point
    ├── seed.js                # sample data seeder (MongoDB)
    ├── config/db.js
    ├── models/Article.js
    ├── routes/articles.js
    ├── .env.example
    ├── package.json
    └── mysql-alternative/
        ├── schema.sql
        ├── server.mysql.js
        └── package.json
```

## 1. Frontend

The frontend is plain HTML/CSS/JS with Bootstrap loaded via CDN — no build step required.

```bash
cd frontend
# open index.html directly in a browser, or serve it:
npx serve .
```

By default it calls the API at `http://localhost:5000/api`. To point it elsewhere,
set `window.API_BASE_URL` before `main.js` loads, e.g.:

```html
<script>window.API_BASE_URL = "https://your-api.example.com/api";</script>
<script src="js/main.js"></script>
```

If the API is unreachable, the page automatically falls back to built-in sample
data so the UI still renders.

**Dark mode**: click the moon/sun icon button in the header. It toggles Bootstrap's
`data-bs-theme` attribute between `light` and `dark`. On first load it follows the
visitor's OS-level preference (`prefers-color-scheme`).

**Responsive**: the layout uses Bootstrap's grid (`col-12`, `col-sm-6`, `col-lg-8`, etc.),
a collapsible navbar below the `lg` breakpoint, and extra CSS tweaks under 768px/576px
for tighter spacing, smaller type, and stacked ad slots.

## 2. Backend — MongoDB (default)

Requirements: Node.js 18+, MongoDB running locally or an Atlas connection string.

```bash
cd backend
cp .env.example .env      # edit MONGODB_URI if needed
npm install
npm run seed               # populate sample articles
npm run dev                 # starts on http://localhost:5000 (nodemon)
```

### API endpoints

| Method | Endpoint               | Description                      |
|--------|-------------------------|-----------------------------------|
| GET    | /api/articles            | List articles (paginated, filterable by `?category=`) |
| GET    | /api/articles/popular     | Top 5 popular articles by views  |
| GET    | /api/articles/:id         | Single article (increments views) |
| POST   | /api/articles             | Create an article                |
| PUT    | /api/articles/:id         | Update an article                |
| DELETE | /api/articles/:id         | Delete an article                |

Example article body for POST/PUT:

```json
{
  "title": "Article title",
  "excerpt": "Short summary",
  "body": "Full article text",
  "category": "សេដ្ឋកិច្ច",
  "isFeatured": true,
  "isPopular": false
}
```

## 3. Backend — MySQL (alternative)

If you'd rather use MySQL instead of MongoDB:

```bash
# 1. Create the database and table
mysql -u root -p < backend/mysql-alternative/schema.sql

# 2. Install the MySQL driver alongside the existing deps
cd backend
npm install mysql2

# 3. Add MySQL credentials to .env
echo "MYSQL_HOST=127.0.0.1" >> .env
echo "MYSQL_USER=root" >> .env
echo "MYSQL_PASSWORD=yourpassword" >> .env
echo "MYSQL_DATABASE=sme_news" >> .env

# 4. Run the MySQL server instead of server.js
node mysql-alternative/server.mysql.js
```

This exposes the same `/api/articles` endpoints as the MongoDB version, so the
frontend works unchanged against either backend.

## Notes

- CORS is enabled on the API so the static frontend (served from any origin/port)
  can call it directly during development.
- For production, set `MONGODB_URI` (or the `MYSQL_*` vars) to your managed
  database, put the frontend behind a static host or reverse proxy, and set
  `window.API_BASE_URL` to your deployed API URL.
