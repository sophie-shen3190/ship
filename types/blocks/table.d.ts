export interface TableColumn {
  name: string;
  title?: string;
  type?: string;
  className?: string;
  callback?: (item: any) => any;
}

export interface Table {
  columns: TableColumn[];
  data: any[];
}
