import React from 'react';
import { FaChartLine } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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

const SpendingTrendsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty-state">
        <p><FaChartLine /> No spending data available for the selected period</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
        <Line 
          type="monotone" 
          dataKey="expenses" 
          stroke="#8B5CF6" 
          strokeWidth={3}
          dot={{ fill: '#8B5CF6', r: 4 }}
          activeDot={{ r: 6 }}
          name="Expenses"
        />
        <Line 
          type="monotone" 
          dataKey="income" 
          stroke="#10B981" 
          strokeWidth={3}
          dot={{ fill: '#10B981', r: 4 }}
          activeDot={{ r: 6 }}
          name="Income"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SpendingTrendsChart;
