const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const blogRoutes = require('./src/routes/blogRoutes');

dotenv.config();
require('./src/config/db');

// INITIALIZE APP
const app = express();


// MIDDLEWARES
app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// STATIC FOLDER
app.use(
    "/uploads",
    express.static("src/uploads")
);


// ROUTES
app.use(
    '/api/quotes',
    require('./src/routes/quoteRoutes')
);

app.use(
    '/api/locations',
    require('./src/routes/locationRoutes')
);

app.use(
    '/api/admin',
    require('./src/routes/adminRoutes')
);

app.use(
    '/api/content',
    require('./src/routes/contentRoutes')
);

app.use(
    '/api/faqs',
    require('./src/routes/faqRoutes')
);

app.use(
    '/api/blogs',
    blogRoutes
);


// HOME ROUTE
app.get('/', (req, res) => {

    res.send(`
        <h1>
            Moving Admin Backend Server Running Successfully!
        </h1>

        <p>
            Server is live on port
            ${process.env.PORT || 5000}
        </p>
    `);

});


// 404 ROUTE
app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found"
    });

});


// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `🚀 Server is running on http://localhost:${PORT}`
    );

});