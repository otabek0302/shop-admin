import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useConfirmStore } from "@/store/confirm-store";

const ConfirmDialog = ({ message, title, action, cancel, onConfirm }: { message: string; title: string; action: string; cancel: string; onConfirm: () => void }) => {
  const { isOpen, closeConfirm } = useConfirmStore();
  return (
    <AlertDialog open={isOpen} onOpenChange={() => closeConfirm()}>
      <AlertDialogContent>  
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-200 hover:bg-gray-100 cursor-pointer dark:bg-gray-800 dark:text-white" onClick={() => closeConfirm()}>{cancel}</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-600 cursor-pointer dark:text-white" onClick={() => onConfirm()}>{action}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
