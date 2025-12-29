import React, { useState, useEffect } from 'react';
import InputSection from './components/InputSection';
import ListSection from './components/ListSection';
import ChartSection from './components/ChartSection';
import { analyzeTransaction } from './utils/gemini';
import { Settings, Download } from 'lucide-react';

export default function App() {
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('transactions');
        return saved ? JSON.parse(saved) : [];
    });

    const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('gemini_api_key', apiKey);
    }, [apiKey]);

    const handleTransactionSubmit = async (text) => {
        if (!apiKey) {
            alert("Please set your Gemini API Key in settings first.");
            setShowSettings(true);
            return;
        }

        setIsProcessing(true);
        try {
            const result = await analyzeTransaction(text, apiKey);
            if (result) {
                const newTransaction = {
                    id: Date.now(),
                    ...result,
                    originalText: text
                };
                setTransactions(prev => [newTransaction, ...prev]);
            } else {
                alert("Could not extract transaction details. Please try again.");
            }
        } catch (error) {
            alert("Error processing transaction: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const handleExport = () => {
        if (transactions.length === 0) {
            alert("No transactions to export yet!");
            return;
        }

        const headers = ["Date", "Category", "Amount", "Original Text"];
        const csvContent = [
            headers.join(","),
            ...transactions.map(t => [
                t.date,
                t.category,
                t.amount,
                `"${t.originalText.replace(/"/g, '""')}"` // Escape quotes
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto flex flex-col md:flex-row gap-8">

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-3xl shadow-xl w-96 max-w-full m-4">
                        <h3 className="text-lg font-semibold mb-4">Settings</h3>
                        <label className="block text-sm text-morandi-muted mb-2">Gemini API Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full p-3 border rounded-xl mb-4 text-morandi-text"
                            placeholder="Paste your API key..."
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-4 py-2 bg-morandi-text text-white rounded-lg hover:bg-black transition-colors"
                            >
                                Save
                            </button>
                        </div>
                        <p className="text-xs text-morandi-muted mt-4">
                            Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" className="underline">Google AI Studio</a>
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-8 px-4">
                    <h1 className="text-3xl font-light tracking-tight text-morandi-text">
                        Mindful<span className="font-bold">Spend</span>
                    </h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleExport}
                            className="p-2 rounded-full hover:bg-morandi-bg transition-colors text-morandi-muted"
                            title="Export to CSV"
                        >
                            <Download size={20} />
                        </button>
                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-2 rounded-full hover:bg-morandi-bg transition-colors text-morandi-muted"
                            title="Settings"
                        >
                            <Settings size={20} />
                        </button>
                    </div>
                </div>

                <InputSection onSubmit={handleTransactionSubmit} isProcessing={isProcessing} />
                <ListSection transactions={transactions} onDelete={handleDelete} />
            </div>

            {/* Sidebar / Top for Charts */}
            <div className="md:w-80 flex-shrink-0">
                <ChartSection transactions={transactions} />

                {/* Total Summary */}
                <div className="mt-6 bg-white rounded-3xl p-6 shadow-sm">
                    <h3 className="text-sm uppercase tracking-widest text-morandi-muted mb-2 font-semibold">Total</h3>
                    <p className="text-4xl font-light text-morandi-text">
                        ${transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
}
