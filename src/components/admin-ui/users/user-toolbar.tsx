"use client";

import UserModal from "./user-modal";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user-store";
import { useModalStore } from "@/store/modal-store";

export default function UserToolbar() {
  const { search, setSearch } = useUserStore();
  const { setOpen } = useModalStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Input placeholder="Filter..." value={search} onChange={handleFilterChange} className="h-10 w-[150px] lg:w-[250px]" />
        <Button onClick={() => setOpen(true)}>Add User</Button>
      </div>
      <UserModal />
    </>
  );
}
