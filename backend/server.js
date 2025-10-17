const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const dotenv = require("dotenv");

dotenv.config();


const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// --- MOCK DATABASE ---
const products = [
    { id: 1, name: 'Eco-Friendly Water Bottle', price: 18.00, category: 'Accessories', tags: ['eco-friendly', 'hydration', 'outdoors'], image: 'https://placehold.co/400x400/3498db/ffffff?text=Bottle' },
    { id: 2, name: 'Modern Desk Lamp', price: 45.00, category: 'Home Goods', tags: ['lighting', 'office', 'modern'], image: 'https://placehold.co/400x400/e74c3c/ffffff?text=Lamp' },
    { id: 3, name: 'Wireless Noise-Cancelling Headphones', price: 199.00, category: 'Electronics', tags: ['audio', 'travel', 'focus'], image: 'https://placehold.co/400x400/2ecc71/ffffff?text=Headphones' },
    { id: 4, name: 'Organic Cotton T-Shirt', price: 25.00, category: 'Apparel', tags: ['clothing', 'eco-friendly', 'casual'], image: 'https://placehold.co/400x400/9b59b6/ffffff?text=T-Shirt' },
    { id: 5, name: 'Smart Fitness Tracker', price: 89.00, category: 'Electronics', tags: ['health', 'wearable', 'fitness'], image: 'https://placehold.co/400x400/f1c40f/ffffff?text=Tracker' },
    { id: 6, name: 'Leather-bound Journal', price: 22.00, category: 'Stationery', tags: ['office', 'writing', 'gift'], image: 'https://placehold.co/400x400/1abc9c/ffffff?text=Journal' },
    { id: 7, name: 'Gourmet Coffee Beans', price: 15.00, category: 'Food & Drink', tags: ['coffee', 'morning', 'gift'], image: 'https://placehold.co/400x400/d35400/ffffff?text=Coffee' },
    { id: 8, name: 'Travel Backpack', price: 75.00, category: 'Accessories', tags: ['travel', 'outdoors', 'storage'], image: 'https://placehold.co/400x400/34495e/ffffff?text=Backpack' },
    { id: 9, name: 'Yoga Mat', price: 30.00, category: 'Sports', tags: ['fitness', 'health', 'yoga'], image: 'https://placehold.co/400x400/7f8c8d/ffffff?text=Yoga+Mat' },
    { id: 10, name: 'Portable Bluetooth Speaker', price: 55.00, category: 'Electronics', tags: ['audio', 'outdoors', 'music'], image: 'https://placehold.co/400x400/c0392b/ffffff?text=Speaker' },
    { id: 11, name: 'Canvas Wall Art', price: 60.00, category: 'Home Goods', tags: ['decor', 'art', 'modern'], image: 'https://placehold.co/400x400/8e44ad/ffffff?text=Art' },
    { id: 12, name: 'Comfortable Running Shoes', price: 120.00, category: 'Apparel', tags: ['fitness', 'footwear', 'running'], image: 'https://placehold.co/400x400/27ae60/ffffff?text=Shoes' }
];


// --- API ENDPOINTS ---

// GET all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// POST to get recommendations
app.post('/api/recommendations', (req, res) => {
    const { userHistory } = req.body;
    if (!userHistory || userHistory.length === 0) {
        return res.status(400).json({ message: 'User history is empty.' });
    }

    const viewedProducts = userHistory.map(id => products.find(p => p.id === id));
    const viewedTags = new Set(viewedProducts.flatMap(p => p.tags));
    const viewedCategories = new Set(viewedProducts.map(p => p.category));

    const recommendations = products
        .filter(p => !userHistory.includes(p.id))
        .map(product => {
            let score = 0;
            product.tags.forEach(tag => {
                if (viewedTags.has(tag)) score += 2;
            });
            if (viewedCategories.has(product.category)) {
                score += 1;
            }
            return { ...product, score };
        })
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

    res.json(recommendations);
});

// POST to get an explanation from the LLM
app.post('/api/explain', async (req, res) => {
    const { userHistory, recommendedProductId } = req.body;

    if (!userHistory || !recommendedProductId) {
        return res.status(400).json({ message: 'Missing user history or recommended product ID.' });
    }

    const recommendedProduct = products.find(p => p.id === recommendedProductId);
    const viewedProducts = userHistory.map(id => products.find(p => p.id === id));
    
    const viewedProductsInfo = viewedProducts.map(p => `- ${p.name} (Category: ${p.category}, Tags: ${p.tags.join(', ')})`).join('\n');
    const recommendedProductInfo = `- ${recommendedProduct.name} (Category: ${recommendedProduct.category}, Tags: ${recommendedProduct.tags.join(', ')})`;

    const userQuery = `
        A user has shown interest in the following products:
        ${viewedProductsInfo}

        Based on this history, we are recommending this product:
        ${recommendedProductInfo}
        
        Please provide a short, friendly, and concise explanation (2-3 sentences) for the user about why this is a good recommendation for them. Speak directly to the user (e.g., "Because you liked...").
    `;

    try {
        const apiKey = process.env.GEMINI_API_KEY; // IMPORTANT: In a real app, use process.env.GEMINI_API_KEY
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
        };

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            throw new Error(`API call failed with status: ${apiResponse.status}`);
        }

        const result = await apiResponse.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
            res.json({ explanation: text });
        } else {
            res.json({ explanation: "Sorry, we couldn't generate an explanation at this time. It seems like a good fit based on items you've previously viewed." });
        }

    } catch (error) {
        console.error("Error fetching explanation:", error);
        res.status(500).json({ message: "Error generating explanation." });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
