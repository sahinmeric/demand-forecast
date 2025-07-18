export type PreviewRow = Record<string, string>;

export type UploadPreview = {
  name: string;
  preview: PreviewRow[];
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
