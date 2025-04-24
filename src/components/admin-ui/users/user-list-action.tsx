import { Button } from "@/components/ui/button";
import { UserListActionsProps } from "@/interfaces/user";
import { useConfirmStore } from "@/store/confirm-store";
import { useModalStore } from "@/store/modal-store";
import { useUserStore } from "@/store/user-store";
import { PencilIcon, TrashIcon } from "lucide-react";

const UserListActions = ({ user }: UserListActionsProps) => {
  const { setDeleteData, setEditData } = useUserStore();
  const { openConfirm } = useConfirmStore();
  const { setOpen } = useModalStore();

  const handleClick = (action: "edit" | "delete") => {
    if (action === "edit") {
      setEditData(user);
      setOpen(true);
    } else {
      setDeleteData(user);
      openConfirm();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button size="icon" variant="outline" onClick={() => handleClick("edit")} className="h-9 w-9 border hover:bg-accent hover:text-primary text-primary cursor-pointer">
        <PencilIcon className="w-4 h-4" />
      </Button>
      <Button size="icon" variant="destructive" onClick={() => handleClick("delete")} className="h-9 w-9 cursor-pointer">
        <TrashIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default UserListActions;
