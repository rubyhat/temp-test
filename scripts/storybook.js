const express = require('express');

const app = express();
const PORT = process.env.PORT || 6006;
const HOST = process.env.HOST || '127.0.0.1';

app.use(express.static('storybook-static'));
app.use(express.static('public'));

app.listen(PORT, HOST, () => {
    console.log(`> Ready on http://${HOST}:${PORT}`);
});
