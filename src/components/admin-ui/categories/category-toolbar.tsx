"use client";

import CategoryModal from "./category-modal";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/modal-store";
import { useCategoryStore } from "@/store/category-store";

const CategoryTableToolbar = () => {
  const { setOpen } = useModalStore();
  const { search, setSearch } = useCategoryStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Input placeholder="Filter..." value={search} onChange={handleFilterChange} className="h-10 w-[150px] lg:w-[250px]" />
        <Button onClick={() => setOpen(true)}>Add Category</Button>
      </div>
      <CategoryModal />
    </>
  );
};

export default CategoryTableToolbar;
