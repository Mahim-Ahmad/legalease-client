"use client";

import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { apiFetch } from "../../../../lib/api";
import RoleRoute from "../../../../components/RoleRoute";
import DashboardSidebar from "../../../../components/DashboardSidebar";
import Loader from "../../../../components/Loader";

function AllTransactionsContent() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiFetch("/transactions", { token }).then(setTransactions).catch(() => setTransactions([])).finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row gap-6">
      <DashboardSidebar />
      <div className="flex-1">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white font-serif">All Transactions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Every completed payment on LegalEase.</p>

        {loading ? <Loader /> : transactions.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><Inbox size={32} className="mx-auto mb-3" /><p className="text-sm">No transactions yet.</p></div>
        ) : (
          <div className="mt-6 overflow-x-auto bg-white dark:bg-[#131d35] rounded-2xl border border-navy-100 dark:border-white/10 card-shadow">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-navy-100 dark:border-white/10">
                  <th className="px-4 py-3 font-medium">Transaction ID</th>
                  <th className="px-4 py-3 font-medium">Client Email</th>
                  <th className="px-4 py-3 font-medium">Lawyer</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id} className="border-b border-navy-50 dark:border-white/5 last:border-0">
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">{t.transactionId}</td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{t.email}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{t.lawyerName}</td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-semibold">${t.amount}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AllTransactions() {
  return <RoleRoute allow={["admin"]}><AllTransactionsContent /></RoleRoute>;
}
