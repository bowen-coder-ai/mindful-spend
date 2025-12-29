import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];

export default function ChartSection({ transactions }) {
    const data = useMemo(() => {
        const summary = transactions.reduce((acc, curr) => {
            const cat = curr.category || 'Others';
            acc[cat] = (acc[cat] || 0) + curr.amount;
            return acc;
        }, {});

        return Object.keys(summary).map((key, index) => ({
            name: key,
            value: summary[key],
        }));
    }, [transactions]);

    if (transactions.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-morandi-muted font-light">
                No data yet
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-80 w-full bg-white rounded-3xl p-6 shadow-sm"
        >
            <h3 className="text-sm uppercase tracking-widest text-morandi-muted mb-4 font-semibold">Spending</h3>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
