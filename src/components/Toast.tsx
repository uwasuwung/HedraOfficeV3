import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  title?: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div
      id="toast-notifications-container"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
  key?: React.Key;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const { id, message, type, title, duration = 4000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  // Color mappings based on alert type
  const typeMap = {
    success: {
      bg: "bg-white border-emerald-200 text-emerald-800 shadow-emerald-500/5",
      iconColor: "text-emerald-500",
      icon: CheckCircle2,
      defaultTitle: "Berhasil",
    },
    error: {
      bg: "bg-white border-rose-200 text-rose-800 shadow-rose-500/5",
      iconColor: "text-rose-500",
      icon: AlertCircle,
      defaultTitle: "Gagal",
    },
    warning: {
      bg: "bg-white border-amber-250 text-amber-900 shadow-amber-500/5",
      iconColor: "text-amber-500",
      icon: AlertTriangle,
      defaultTitle: "Peringatan",
    },
    info: {
      bg: "bg-white border-blue-200 text-blue-800 shadow-blue-500/5",
      iconColor: "text-blue-500",
      icon: Info,
      defaultTitle: "Informasi",
    },
  };

  const currentType = typeMap[type] || typeMap.info;
  const IconComponent = currentType.icon;

  return (
    <motion.div
      id={`toast-item-${id}`}
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex gap-3 p-4 rounded-xl border shadow-xl ${currentType.bg} font-sans`}
    >
      <div className="shrink-0 pt-0.5" id={`toast-icon-${id}`}>
        <IconComponent className={`w-5 h-5 ${currentType.iconColor}`} />
      </div>

      <div className="flex-1 min-w-0" id={`toast-content-${id}`}>
        <span className="block text-xs font-bold text-slate-800 leading-snug">
          {title || currentType.defaultTitle}
        </span>
        <span className="block text-[11px] text-slate-500 mt-1 leading-relaxed">
          {message}
        </span>
      </div>

      <button
        id={`toast-close-btn-${id}`}
        onClick={() => onClose(id)}
        className="shrink-0 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors h-fit cursor-pointer"
        aria-label="Tutup"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
