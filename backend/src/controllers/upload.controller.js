const xlsx = require('xlsx');
const csv = require('csv-parser');
const { Readable } = require('stream');

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

module.exports = { uploadFile };
