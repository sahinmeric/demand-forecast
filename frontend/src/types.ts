export type PreviewRow = Record<string, string>;

export type UploadPreview = {
  name: string;
  preview: PreviewRow[];
};

export type FieldMapping = {
  [key: string]: string;
};
