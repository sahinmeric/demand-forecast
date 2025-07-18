export type FieldValidator = (value: string) => boolean;

export const validators: Record<string, FieldValidator> = {
  // Alphanumeric SKU, 3–20 characters, no spaces
  sku: (val) => /^[A-Za-z0-9]{3,20}$/.test(val),

  // ISO/locale-parseable date
  fecha: (val) => !isNaN(Date.parse(val)),

  // Integer between 1 and 100,000
  cantidad_vendida: (val) => {
    const num = Number(val);
    return /^\d+$/.test(val) && num >= 1 && num <= 100000;
  },

  // Decimal with up to 4 decimals
  precio: (val) => /^\d+(\.\d{1,4})?$/.test(val),

  // Boolean-ish values accepted (true/false, 1/0, sí/no)
  promocion_activa: (val) => /^(true|false|1|0|sí|no)$/i.test(val.trim()),

  // Any non-empty string
  categoria: (val) => val.trim().length > 0,
};
