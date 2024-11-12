export interface IProducts {
  name: string;
  storeId?: string;
  categoriesId?: string;
  description: string;
  brandId?: string;
  isArchived: boolean;
  isFeatured: boolean;
  createAt: Date;
  updateAt: Date;
}
