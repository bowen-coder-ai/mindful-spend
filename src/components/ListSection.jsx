import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function ListSection({ transactions, onDelete }) {
    if (transactions.length === 0) return null;

    return (
        <div className="w-full mt-8">
            <h3 className="text-sm uppercase tracking-widest text-morandi-muted mb-4 font-semibold px-4">Recent</h3>
            <ul className="space-y-3">
                <AnimatePresence>
                    {transactions.map((t) => (
                        <motion.li
                            key={t.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium text-morandi-text text-lg">{t.category}</span>
                                <span className="text-xs text-morandi-muted">{format(new Date(t.date), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="font-semibold text-lg text-morandi-text">
                                    -${t.amount.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => onDelete(t.id)}
                                    className="opacity-0 group-hover:opacity-100 text-morandi-muted hover:text-red-400 text-sm transition-opacity"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </div>
    );
}
