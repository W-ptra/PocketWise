import LoadingSpinner from "@/components/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { getRequest } from "~utils/api";
import { getToken } from "~utils/localStorage";

const columnHelper = createColumnHelper();

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
};

const columns = [
  columnHelper.accessor("Amount", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 hover:text-gray-900 transition-colors group"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <span className="inline-flex opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            {{
              asc: <ChevronUp className="h-4 w-4" />,
              desc: <ChevronDown className="h-4 w-4" />,
              false: <ChevronUp className="h-4 w-4 text-gray-400" />,
            }[column.getIsSorted()] ?? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            )}
          </span>
        </button>
      );
    },
  }),
  columnHelper.accessor("Title", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 hover:text-gray-900 transition-colors group cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <span className="inline-flex opacity-0 group-hover:opacity-100 transition-opacity">
            {{
              asc: <ChevronUp className="h-4 w-4" />,
              desc: <ChevronDown className="h-4 w-4" />,
              false: <ChevronUp className="h-4 w-4 text-gray-400" />,
            }[column.getIsSorted()] ?? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            )}
          </span>
        </button>
      );
    },
  }),
  columnHelper.accessor("Transaction Type", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 hover:text-gray-900 transition-colors group cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Transaction Type
          <span className="inline-flex opacity-0 group-hover:opacity-100 transition-opacity">
            {{
              asc: <ChevronUp className="h-4 w-4" />,
              desc: <ChevronDown className="h-4 w-4" />,
              false: <ChevronUp className="h-4 w-4 text-gray-400" />,
            }[column.getIsSorted()] ?? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            )}
          </span>
        </button>
      );
    },
  }),
  columnHelper.accessor("Date", {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 hover:text-gray-900 transition-colors group cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <span className="inline-flex opacity-0 group-hover:opacity-100 transition-opacity">
            {{
              asc: <ChevronUp className="h-4 w-4" />,
              desc: <ChevronDown className="h-4 w-4" />,
              false: <ChevronUp className="h-4 w-4 text-gray-400" />,
            }[column.getIsSorted()] ?? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            )}
          </span>
        </button>
      );
    },
  }),
];

function TransactionTable() {
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const { data: transactionData, isLoading } = useQuery({
    queryKey: ["transactions", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      const token = getToken();
      if (!token) {
        return { data: [], pageCount: 0 };
      }
      const result = await getRequest(
        `api/transaction?pagination=true&page=${pagination.pageIndex + 1}&pageSize=${pagination.pageSize}`, 
        token
      );
      if (result.error) throw new Error(result.error);
      
      const transactions = result.data?.data || [];
      
      return {
        data: transactions.map(transaction => ({
          Amount: formatCurrency(transaction.amount),
          Title: transaction.title,
          "Transaction Type": transaction.type,
          Date: new Date(transaction.createdAt).toLocaleDateString()
        })),
        pageCount: result.data.totalPages
      };
    },
  });

  const table = useReactTable({
    data: transactionData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: transactionData?.pageCount ?? 0,
    state: {
      sorting,
      pagination,
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={`bg-gray-50/80 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 ${
                      index === 0 ? "first:rounded-tl-xl" : ""
                    } ${
                      index === headerGroup.headers.length - 1
                        ? "last:rounded-tr-xl"
                        : ""
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No transactions found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-gray-50/60"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-sm text-gray-600">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {table.getRowModel().rows.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>Page</span>
            <strong className="font-semibold text-gray-900">
              {table.getState().pagination.pageIndex + 1}
            </strong>
            <span>of</span>
            <strong className="font-semibold text-gray-900">
              {transactionData?.pageCount || 0}
            </strong>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default TransactionTable;
