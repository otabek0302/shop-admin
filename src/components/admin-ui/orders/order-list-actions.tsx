import { Button } from "@/components/ui/button";
import { PrinterIcon, TrashIcon } from "lucide-react";
import { PencilIcon } from "lucide-react";
import { useConfirmStore } from "@/store/confirm-store";
import { useModalStore } from "@/store/modal-store";
import { useOrderStore } from "@/store/order-store";
import { OrderListActionsProps } from "@/interfaces/orders";
import { useRouter } from "next/navigation";

const OrderListActions = ({ order }: OrderListActionsProps) => {
  const { setDeleteData, setEditData } = useOrderStore();
  const { openConfirm } = useConfirmStore();
  const { setOpen } = useModalStore();
  const router = useRouter();

  const handleClick = (action: "edit" | "delete" | "print") => {
    if (action === "edit") {
      setEditData(order);
      setOpen(true);
    } else if (action === "delete") {
      setDeleteData(order);
      openConfirm();
    } else if (action === "print") {
      router.push(`/admin/orders/${order.id}/invoice`);
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
      <Button size="icon" variant="outline" onClick={() => handleClick("print")} className="h-9 w-9 border hover:bg-accent hover:text-primary text-primary cursor-pointer">
        <PrinterIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default OrderListActions;