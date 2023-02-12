const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

app.get('/test', (req, res) => {
    res.send({ message: 'Test!' });
});

app.listen(3333, () => {
    console.log('Application listening on port http://localhost:3333');
});