import { motion, AnimatePresence } from "framer-motion";
import { PropsWithChildren } from "react";

export default function Modal({ open, onClose, title, children }: PropsWithChildren<{open:boolean; onClose:()=>void; title?:string;}>) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/20"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div onClick={e=>e.stopPropagation()} className="card w-full max-w-lg p-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
            {title && <div className="text-lg font-semibold mb-4">{title}</div>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

