"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { PaginationProps } from "@/interfaces/pagination";

const Pagination = ({ page, setPage, total = 0, perPage = 10 }: PaginationProps) => {
  const totalPages = Math.max(Math.ceil(total / perPage), 1);
  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = total === 0 ? 0 : Math.min(page * perPage, total);

  return (
    <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="text-sm text-muted-foreground">
        {total > 0 ? (
          <>
            Showing <span className="font-medium">{start}</span>–<span className="font-medium">{end}</span> of <span className="font-medium">{total}</span> item(s)
          </>
        ) : (
          <>No items to display</>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(1)} disabled={page === 1 || total === 0}>
          <ChevronsLeftIcon className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(page - 1)} disabled={page === 1 || total === 0}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <span className="text-sm font-medium">
          Page {total === 0 ? 0 : page} of {totalPages}
        </span>

        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(page + 1)} disabled={page === totalPages || total === 0}>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(totalPages)} disabled={page === totalPages || total === 0}>
          <ChevronsRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;