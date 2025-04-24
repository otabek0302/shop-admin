"use client";

import UserRole from "./user-role";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useModalStore } from "@/store/modal-store";
import { useUserStore } from "@/store/user-store";

export default function UserModal() {
  const { open, setOpen } = useModalStore();
  const { editData, createUser, editUser } = useUserStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER",
    password: "",
    phone: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        email: editData.email ?? "",
        role: editData.role ?? "USER",
        password: "",
        phone: editData.phone ?? "",
      });
    }
  }, [editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editData) {
      await editUser(editData.id, formData);
    } else {
      await createUser(formData);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" required className="w-full focus-visible:ring-1 shadow-none" />
          <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" type="email" required className="w-full focus-visible:ring-1 shadow-none" />
          <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone" type="number" required className="w-full focus-visible:ring-1 shadow-none" />
          {!editData && <Input value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Password" type="password" required />}
          {editData && <UserRole role={formData.role} onChange={(value) => setFormData({ ...formData, role: value })} />}
          <div className="mt-4 flex justify-end gap-2">
            <Button type="submit" variant="outline" className="bg-primary text-white hover:bg-primary/90 hover:text-white cursor-pointer">{editData ? "Update" : "Create"}</Button>
            <Button type="button" variant="outline" className="bg-gray-200 hover:bg-gray-100 cursor-pointer" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
