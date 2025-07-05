
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TransactionForm from '@/components/transactions/transactionsForm';
import { Transaction } from '@/types';

interface EditTransactionDialogProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: Omit<Transaction, '_id'>) => void;
}

export default function EditTransactionDialog({
  transaction,
  isOpen,
  onClose,
  onUpdate,
}: EditTransactionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <TransactionForm
          transaction={transaction}
          onSubmit={onUpdate}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
