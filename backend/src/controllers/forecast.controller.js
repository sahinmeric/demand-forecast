const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateForecasts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const horizon = 3; // months to forecast

    const recentSales = await prisma.salesData.findMany({
      where: { userId },
    });

    if (recentSales.length === 0) {
      return res.status(400).json({ message: 'No recent sales data available' });
    }

    const groupedBySKU = groupBySKU(recentSales);
    const forecastsToCreate = [];

    const now = new Date();

    for (const sku in groupedBySKU) {
      const sales = groupedBySKU[sku];
      const avgQty = sales.reduce((sum, r) => sum + r.quantity, 0) / sales.length;

      for (let i = 1; i <= horizon; i++) {
        const forecastDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const seasonalFactor = randomFloat(1.0, 1.2);
        const trend = randomFloat(0.01, 0.05);
        const confidence = [0.8, 0.9, 0.95][Math.floor(Math.random() * 3)];

        const base = Math.round(avgQty * (1 + trend));
        const lower = Math.round(base * 0.8);
        const upper = Math.round(base * 1.2);

        forecastsToCreate.push({
          userId,
          sku,
          forecastDate,
          baseValue: base,
          lowerBound: lower,
          upperBound: upper,
          confidenceLevel: confidence,
          seasonalFactor,
          trendComponent: trend,
          modelVersion: 'v1.0',
          dataQualityScore: randomFloat(0.7, 0.95),
        });
      }
    }

    await prisma.forecast.createMany({ data: forecastsToCreate });

    res.status(201).json({
      message: `Generated ${forecastsToCreate.length} forecasts for ${Object.keys(groupedBySKU).length} SKUs.`,
    });
  } catch (err) {
    console.error('Forecast generation error:', err);
    res.status(500).json({ message: 'Forecast generation failed' });
  }
};

const generateForecastForSKU = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sku } = req.params;
    const horizon = 3;

    if (!sku) {
      return res.status(400).json({ message: 'SKU is required' });
    }

    const sales = await prisma.salesData.findMany({
      where: { userId, sku },
    });

    if (sales.length === 0) {
      return res.status(404).json({ message: `No sales data for SKU ${sku}` });
    }

    const avgQty = sales.reduce((sum, r) => sum + r.quantity, 0) / sales.length;
    const now = new Date();
    const forecasts = [];

    for (let i = 1; i <= horizon; i++) {
      const forecastDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const seasonalFactor = randomFloat(1.0, 1.2);
      const trend = randomFloat(0.01, 0.05);
      const confidence = [0.8, 0.9, 0.95][Math.floor(Math.random() * 3)];

      const base = Math.round(avgQty * (1 + trend));
      const lower = Math.round(base * 0.8);
      const upper = Math.round(base * 1.2);

      forecasts.push({
        userId,
        sku,
        forecastDate,
        baseValue: base,
        lowerBound: lower,
        upperBound: upper,
        confidenceLevel: confidence,
        seasonalFactor,
        trendComponent: trend,
        modelVersion: 'v1.0',
        dataQualityScore: randomFloat(0.7, 0.95),
      });
    }

    await prisma.forecast.createMany({ data: forecasts });

    res.status(201).json({ message: `Generated ${forecasts.length} forecasts for ${sku}` });
  } catch (err) {
    console.error('Forecast generation failed for SKU:', err);
    res.status(500).json({ message: 'Failed to generate forecast for SKU' });
  }
};


// --- helpers ---

function groupBySKU(rows) {
  return rows.reduce((acc, row) => {
    acc[row.sku] = acc[row.sku] || [];
    acc[row.sku].push(row);
    return acc;
  }, {});
}

function randomFloat(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(2);
}

const getForecasts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const forecasts = await prisma.forecast.findMany({
      where: { userId },
      orderBy: { forecastDate: 'asc' },
    });

    res.status(200).json({ forecasts });
  } catch (err) {
    console.error('Fetch forecasts error:', err);
    res.status(500).json({ message: 'Failed to load forecasts' });
  }
};

const getForecastsBySKU = async (req, res) => {
  try {
    const userId = req.user.userId;
    const sku = req.params.sku;
    const forecasts = await prisma.forecast.findMany({
      where: { userId, sku },
      orderBy: { forecastDate: 'asc' },
    });
    res.json({ forecasts });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching forecast data' });
  }
};


module.exports = {
  generateForecasts,
  generateForecastForSKU,
  getForecasts,
  getForecastsBySKU,
};
