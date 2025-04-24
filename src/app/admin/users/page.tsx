"use client";

import UserToolbar from "@/components/admin-ui/users/user-toolbar";
import UserList from "@/components/admin-ui/users/user-list";
import Pagination from "@/components/ui/pagination";

import { useUserStore } from "@/store/user-store";
import { useEffect } from "react";

export default function UsersPage() {
  const { total, page, search, setPage, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [search, page, fetchUsers]);

  return (
    <div className="h-full space-y-4 p-4 flex flex-col justify-between">
      <UserToolbar />
      <UserList />
      <Pagination page={page} setPage={setPage} total={total} perPage={10} />
    </div>
  );
}
