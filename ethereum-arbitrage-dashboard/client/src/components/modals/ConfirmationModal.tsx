import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  destructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isSubmitting = false,
  destructive = false,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-card border border-border">
        <AlertDialogHeader>
          <div className="flex flex-col items-center text-center">
            <div className={cn(
              "inline-flex items-center justify-center h-16 w-16 rounded-full mb-4",
              destructive 
                ? "bg-red-900/20 text-red-500" 
                : "bg-blue-900/20 text-blue-500"
            )}>
              <AlertTriangle className="h-8 w-8" />
            </div>
            <AlertDialogTitle className="text-lg font-bold">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground mt-2">
              {message}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex space-x-3">
          <AlertDialogCancel 
            className="flex-1 py-2 border border-border rounded-lg hover:bg-muted transition"
            disabled={isSubmitting}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              "flex-1 py-2 rounded-lg font-medium",
              destructive 
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            )}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
