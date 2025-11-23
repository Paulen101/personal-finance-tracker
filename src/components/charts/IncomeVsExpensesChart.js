import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatDate, formatCurrency } from '../../utils/analyticsHelpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{formatDate(label)}</p>
        {payload.map((entry, index) => (
          <p key={index} className="tooltip-value" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const IncomeVsExpensesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty-state">
        <p>📊 No transaction data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate}
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
        />
        <Bar 
          dataKey="income" 
          fill="#10B981" 
          radius={[8, 8, 0, 0]}
          name="Income"
        />
        <Bar 
          dataKey="expenses" 
          fill="#EF4444" 
          radius={[8, 8, 0, 0]}
          name="Expenses"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default IncomeVsExpensesChart;
