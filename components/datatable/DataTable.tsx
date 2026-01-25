/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


export type Column<T> = {
  key: keyof T;
  header: React.ReactNode | (() => React.ReactNode);
  align?: "left" | "center" | "right";
  render?: (value: any, row: T) => React.ReactNode;
};

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  searchPlaceholder?: string;
  onToggleStatus?: (row: T) => void;
  isSkeleton?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSizeOptions = [10 ,25, 50, 100],
  defaultPageSize = 10,
  searchPlaceholder = "Search...",
  onToggleStatus,
  isSkeleton = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  /* 🔍 Search */
  const filteredData = useMemo(() => {
    if (isSkeleton) return [];
    if (!search) return data;
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search , isSkeleton]);

  /* 📄 Pagination */
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Input
          disabled={isSkeleton}
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />

        {/* Page Size */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Show</span>
          <select
            disabled={isSkeleton}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="h-9 rounded-md border bg-background px-2 text-sm focus:outline-none"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-muted-foreground">entries</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={`font-semibold ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : ""
                  }`}
                >
                  {typeof col.header === "function"
                    ? col.header()
                    : col.header} 
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
              {isSkeleton ? (
                Array.from({ length: pageSize }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((col, colIndex) => (
                      <TableCell key={colIndex} className="py-4">
                        <Skeleton className="h-4 w-full rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedData.length ? (
                paginatedData.map((row, index) => (
                  <TableRow
                    key={index}
                    className={`
                      ${index % 2 === 0 ? "bg-background" : "bg-muted/30"}
                      hover:bg-muted/50 transition-colors
                    `}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        className={`py-4 ${
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                            ? "text-right"
                            : ""
                        }`}
                      >
                        {col.key === "status" && onToggleStatus ? (
                          <div className="flex justify-center items-center gap-2">
                            <Switch
                              checked={row[col.key]}
                              onCheckedChange={() => onToggleStatus(row)}
                            />
                            <span className="text-sm">
                              {row[col.key] ? "مفعل" : "غير مفعل"}
                            </span>
                          </div>
                        ) : col.render ? (
                          col.render(row[col.key], row)
                        ) : (
                          // String(row[col.key])
                          row[col.key] == null ? "-" : String(row[col.key])
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">
          {isSkeleton
            ? "Loading..."
            : `Showing ${(page - 1) * pageSize + 1}–${Math.min(
                page * pageSize,
                filteredData.length
              )} of ${filteredData.length}`}
        </span>


        <div className="flex gap-1">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setPage(1)}
            disabled={isSkeleton || page === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={isSkeleton || page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            // disabled={page === totalPages}
            disabled={isSkeleton || page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setPage(totalPages)}
            // disabled={page === totalPages}
            disabled={isSkeleton || page === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
