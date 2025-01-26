export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface Pagination {
  skip: number;
  take: number;
}

export interface Filter {
  name: string;
  value: number | string | boolean | null;
}

export interface OrderBy {
  column: string;
  order: string;
}

export interface QueryObject {
  pagination?: Pagination | null | undefined;
  filters?: Filter[] | null | undefined;
  filteredWithOr?: boolean;
  orderBy?: OrderBy | null | undefined;
}