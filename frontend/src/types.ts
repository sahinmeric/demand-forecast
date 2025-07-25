export type User = {
  id: number;
  email: string;
  role: "user" | "admin";
};

export type PreviewRow = Record<string, string>;

export type UploadPreview = {
  name: string;
  preview: PreviewRow[];
  fullData: PreviewRow[];
};

export type FieldMapping = {
  [key: string]: string;
};

export type SalesRow = {
  id: number;
  sku: string;
  date: string;
  quantity: number;
  price: number;
  promotion: boolean;
  category: string;
  fileName: string;
  uploadedAt: string;
};

export type Filters = {
  sku?: string;
  fromDate?: string;
  toDate?: string;
};

export type SalesRecord = { date: string; quantity: number };

export type ForecastRecord = {
  forecastDate: string;
  baseValue: number;
  upperBound: number;
  lowerBound: number;
};

export type CombinedRow = {
  date: string;
  actual?: number;
  forecast?: number;
  upper?: number;
  lower?: number;
};
