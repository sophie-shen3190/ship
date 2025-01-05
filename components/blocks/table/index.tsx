import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TableColumn } from "@/types/blocks/table";

export default function ({
  columns,
  data,
}: {
  columns: TableColumn[];
  data: any[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((item: TableColumn) => {
            return (
              <TableHead key={item.name} className={item.className}>
                {item.title}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: any, idx: number) => (
          <TableRow key={idx}>
            {columns.map((column: TableColumn) => {
              return (
                <TableCell key={column.name} className={column.className}>
                  {column.callback ? column.callback(item) : item[column.name]}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
