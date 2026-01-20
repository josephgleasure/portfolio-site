// book-catalog-react/src/components/types.ts
export interface Stamp {
  id: string;
  name: string;
}

export interface GridCell {
  stamp: Stamp | null;
}