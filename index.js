const express = require('express');
const app = express();
const path = require('path');

// Store mappings of shortened URLs to original URLs
const urlMap = new Map();

// Middleware to parse JSON bodies
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to shorten a URL
app.post('/shorten', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Generate a short ID (you can use a more sophisticated method here)
    const shortId = Math.random().toString(36).substring(7);
    const shortUrl = `http://localhost:3000/${shortId}`;

    // Store the mapping of short URL to original URL
    urlMap.set(shortId, url);

    res.json({ shortUrl });
});

// Route to redirect to original URL
app.get('/:shortId', (req, res) => {
    const { shortId } = req.params;
    const originalUrl = urlMap.get(shortId);
    if (!originalUrl) {
        return res.status(404).send('URL not found');
    }

    res.redirect(originalUrl);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
