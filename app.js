const express = require('express');
//const todoRoutes = require('./routes/todo.js'); 
const session = require('express-session');
require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');

const db = require('./database/db');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/tododb.js');
const { isAuthenticated } = require('./middlewares/middleware.js');
//const router = require('./routes/todo.js');
//import session
const app = express();
// const port = 3000;
const port = process.env.PORT;



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set ke true jika menggunakan HTTPS
}));

// View Engine Configuration
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');

// Middleware untuk menambahkan `user` ke semua tampilan
app.use((req, res, next) => {
    res.locals.user = req.session.userId ? { id: req.session.userId } : null;  // Periksa session
    next();
});
// Static FIles
app.use(express.static('public'));
// Layout Middleware
app.use(expressLayouts);
// Authentication and Routes
app.use('/',authRoutes);
app.use('/todos', todoRoutes);

// Routes with Middleware
app.get('/', isAuthenticated, (req, res) => {
    res.render('index');
});

app.get('/contact', isAuthenticated, (req, res) => {
    res.render('contact');
});

app.get('/todo-view', isAuthenticated, (req, res) => {
    db.query('SELECT * FROM todos', (err, todos) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('todo', { todos: todos });
    });
});

// Rute untuk logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/login');
    });
});


app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

//Pembenahan Logika Route