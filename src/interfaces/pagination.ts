export interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  total: number;
  perPage?: number;
}
