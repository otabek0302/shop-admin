"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface UserRoleProps {
  role: string;
  onChange: (value: string) => void;
}

export default function UserRole({ role, onChange }: UserRoleProps) {
  const { t } = useTranslation();

  return (
    <Select value={role} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t("components.admin-ui.user.user-role.placeholder")} className="text-sm text-muted-foreground cursor-pointer" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user" className="cursor-pointer text-sm">{t("components.admin-ui.user.user-role.user")}</SelectItem>
        <SelectItem value="admin" className="cursor-pointer text-sm">{t("components.admin-ui.user.user-role.admin")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
