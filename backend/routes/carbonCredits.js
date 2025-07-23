const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// This endpoint simulates fetching carbon credit portfolio data.
router.get('/summary', protect, async (req, res) => {
    try {
        // --- SIMULATED DYNAMIC DATA ---
        const baseMarketPrice = 25.50; // USD
        const marketPrice = baseMarketPrice + (Math.random() - 0.5); // Simulate market fluctuation
        const totalCredits = 5000;
        const averageCost = 18.20;
        const portfolioValue = totalCredits * marketPrice;
        const unrealizedGain = portfolioValue - (totalCredits * averageCost);

        const creditData = {
            kpis: {
                totalCredits,
                marketPrice: marketPrice,
                portfolioValue: portfolioValue,
                unrealizedGain: unrealizedGain,
            },
            marketTrend: [ // Simulated data for a chart
                { time: '09:00', price: 25.45 },
                { time: '10:00', price: 25.60 },
                { time: '11:00', price: 25.55 },
                { time: '12:00', price: 25.75 },
                { time: '13:00', price: 25.68 },
                { time: '14:00', price: marketPrice },
            ],
            transactionHistory: [
                { id: 1, date: '2024-06-15', type: 'Purchase', quantity: 2000, price: 15.50, status: 'Completed' },
                { id: 2, date: '2024-07-01', type: 'Purchase', quantity: 3000, price: 20.10, status: 'Completed' },
                { id: 3, date: '2024-07-20', type: 'Retire for Offset', quantity: 500, price: null, status: 'Completed' },
            ]
        };

        res.json(creditData);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;