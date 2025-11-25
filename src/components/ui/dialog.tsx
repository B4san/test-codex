import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = DialogPrimitive.Overlay;

export const DialogContent = ({ className, ...props }: DialogPrimitive.DialogContentProps) => (
  <DialogPortal>
    <DialogOverlay className="fixed inset-0 bg-black/70" />
    <DialogPrimitive.Content
      {...props}
      className={cn(
        'fixed left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-muted/90 p-6 shadow-xl focus:outline-none',
        className
      )}
    >
      {props.children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full bg-white/10 p-1 text-white transition hover:bg-white/20">
        <X size={16} />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
);

export const DialogHeader = ({ title, description }: { title: string; description?: string }) => (
  <div className="mb-4 space-y-1">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    {description ? <p className="text-sm text-white/70">{description}</p> : null}
  </div>
);
