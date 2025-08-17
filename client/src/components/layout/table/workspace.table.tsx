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

export function WorkspaceTable<TData>({
  columns,
  data,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-lg border border-neutral-800">
      <Table className="flex flex-col">
        <TableHeader className="flex justify-start items-center">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="w-full flex bg-midnight-200/50"
            >
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "w-full px-4 flex justify-start items-center cursor-pointer h-12",
                    {
                      "border-r": index < headerGroup.headers.length - 1,
                    }
                  )}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row, index) => (
            <TableRow
              key={row.id}
              className={cn("bg-midnight-200 w-full flex", {
                " rounded-b-xl": index === table.getRowModel().rows.length - 1,
              })}
            >
              {row.getVisibleCells().map((cell, index) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    "w-full px-4 flex justify-start items-center cursor-pointer h-12",
                    {
                      "border-r": index < row.getVisibleCells().length - 1,
                    }
                  )}
                  onClick={() => confirm("click bhai!")}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
