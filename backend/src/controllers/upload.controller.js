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
          if (rows.length < 5) rows.push(row);
        })
        .on('end', () => {
          res.status(200).json({ preview: rows, name: originalName });
        });
    } else if (
      originalName.endsWith('.xlsx')
    ) {
      const workbook = xlsx.read(file.buffer, { type: 'buffer', cellDates: true });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json(sheet, { raw: false });
      res.status(200).json({ preview: rows.slice(0, 5), name: originalName });
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

module.exports = {
  uploadFile,
  saveData,
};