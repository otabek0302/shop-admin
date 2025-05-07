"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useModalStore } from "@/store/modal-store";
import { useCategoryStore } from "@/store/category-store";

const CategoryModal = () => {
  const { open, setOpen } = useModalStore();
  const { editData, createCategory, editCategory, setEditData } = useCategoryStore();

  const [name, setName] = useState("");

  useEffect(() => {
    if (editData) {
      setName(editData.name);
    } else {
      setName("");
    }
  }, [editData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editData) {
      await editCategory(editData.id, name);
    } else {
      await createCategory(name);
    }

    setOpen(false);
    setEditData(null);
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] shadow-none">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>{editData ? "Edit the category name" : "Add a new category"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" required className="w-full focus-visible:ring-1 shadow-none" />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" className="bg-gray-200 hover:bg-gray-100 cursor-pointer" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="outline" className="bg-primary text-white hover:bg-primary/90 hover:text-white cursor-pointer">{editData ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
