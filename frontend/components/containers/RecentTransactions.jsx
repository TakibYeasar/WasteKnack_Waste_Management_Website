'use client';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const RecentTransactions = ({ transaction }) => {
  return (
      <div className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
          <div className="flex items-center">
              {transaction.trans_type === 'earned_report' ? (
                  <ArrowUpRight className="w-5 h-5 text-green-500 mr-3" />
              ) : transaction.type === 'earned_collect' ? (
                  <ArrowUpRight className="w-5 h-5 text-blue-500 mr-3" />
              ) : (
                  <ArrowDownRight className="w-5 h-5 text-red-500 mr-3" />
              )}
              <div>
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
          </div>
          <span
              className={`font-semibold ${transaction.trans_type.startsWith('earned') ? 'text-green-500' : 'text-red-500'
                  }`}
          >
              {transaction.trans_type.startsWith('earned') ? '+' : '-'}
              {transaction.amount}
          </span>
      </div>
  )
}

export default RecentTransactions