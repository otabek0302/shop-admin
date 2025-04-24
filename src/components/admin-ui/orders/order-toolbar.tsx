"use client";

import { Input } from "@/components/ui/input";
import { OrderTableToolbarProps } from "@/interfaces/orders";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const OrderTableToolbar = ({ search, setSearch, onAddClick }: OrderTableToolbarProps & { onAddClick: () => void }) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <Input 
          placeholder="Filter orders..." 
          value={search} 
          onChange={handleFilterChange} 
          className="h-10 w-[150px] lg:w-[250px]" 
        />
      </div>
      <div>
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Order
        </Button>
      </div>
    </div>
  );
};

export default OrderTableToolbar; 