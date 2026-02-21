"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils/cn.util";

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

export function AppTable<TData>({ columns, data }: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-lg border border-neutral-800 overflow-hidden">
      <Table className="flex flex-col">
        <TableHeader className="flex justify-start items-center">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="w-full flex bg-midnight-200/50 hover:bg-midnight-200/50"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "w-full px-4 flex justify-start items-center h-10",
                  )}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className={cn("bg-midnight-200 w-full flex")}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn("w-full px-4 flex justify-start items-center")}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow className="bg-midnight-200 hover:bg-midnight-200 w-full flex justify-end px-2">
            <TableCell colSpan={columns.length} className="text-center py-2">
              {data.length} Member{data.length !== 1 ? "s" : ""}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
