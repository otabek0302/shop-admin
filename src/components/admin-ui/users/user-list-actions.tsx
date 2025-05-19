"use client";

import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user-store";
import { useConfirmStore } from "@/store/confirm-store";
import { useTranslation } from "react-i18next";
import { Pencil, Trash } from "lucide-react";

interface UserListActionsProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function UserListActions({ user }: UserListActionsProps) {
  const { setEditData, setDeleteData } = useUserStore();
  const { openConfirm } = useConfirmStore();
  const { t } = useTranslation();

  const handleEdit = () => {
    setEditData(user);
  };

  const handleDelete = () => {
    setDeleteData(user);
    openConfirm();
  };

  return (
    <div className="flex justify-center gap-2">
      <Button variant="ghost" size="icon" onClick={handleEdit} title={t("components.admin-ui.user.user-list.actions.edit")}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleDelete} title={t("components.admin-ui.user.user-list.actions.delete")}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
} 