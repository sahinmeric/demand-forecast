const xlsx = require('xlsx');
const csv = require('csv-parser');
const { Readable } = require('stream');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const mimetype = file.mimetype;
    const originalName = file.originalname;

    if (originalName.endsWith('.csv')) {
      const rows = [];
      const stream = Readable.from(file.buffer)
        .pipe(csv())
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', () => {
          res.status(200).json({
            name: originalName,
            preview: rows.slice(0, 5),
            fullData: rows,
          });
        });
    } else if (
      originalName.endsWith('.xlsx')
    ) {
      const workbook = xlsx.read(file.buffer, { type: 'buffer', cellDates: true });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json(sheet, { raw: false });
      res.status(200).json({
        name: originalName,
        preview: rows.slice(0, 5),
        fullData: rows,
      });
    } else {
      return res.status(400).json({ message: 'Unsupported file format' });
    }
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'File upload failed' });
  }
};

const saveData = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware
    const rows = req.body.rows;
    const fileName = req.body.fileName || 'uploaded_file.csv';

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: 'No rows to save' });
    }

    const dataToInsert = rows.map((row) => ({
      userId,
      sku: row.sku,
      date: new Date(row.fecha),
      quantity: parseInt(row.cantidad_vendida, 10),
      price: parseFloat(row.precio),
      promotion: row.promocion_activa === true,
      category: row.categoria,
      fileName,
      dataVersion: 1,
    }));

    await prisma.salesData.createMany({
      data: dataToInsert,
    });

    res.status(201).json({ message: `Saved ${dataToInsert.length} rows.` });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ message: 'Failed to save data' });
  }
};

const getSalesData = async (req, res) => {
  try {
    const userId = req.user.userId;

    const records = await prisma.salesData.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
    });

    res.status(200).json({ records });
  } catch (err) {
    console.error('Fetch sales data error:', err);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
};

const getSalesDataBySKU = async (req, res) => {
  try {
    const userId = req.user.userId;
    const sku = req.params.sku;
    const data = await prisma.salesData.findMany({
      where: { userId, sku },
      orderBy: { date: 'asc' },
    });
    res.json({ records: data });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sales data' });
  }
};

module.exports = {
  uploadFile,
  saveData,
  getSalesData,
  getSalesDataBySKU,
};