import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import DateDropdown from './DateDropdown';

function ExpenseChart({ data }) {
    const [selectedPeriod, setSelectedPeriod] = useState('today');

    // Format currency
    const formatCurrency = (value) => {
        if (value >= 1000000) {
            return `Rp${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `Rp${(value / 1000).toFixed(1)}K`;
        }
        return `Rp${value}`;
    };

    // Format Y-axis ticks
    const formatYAxis = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return value;
    };

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
        // Here you can add logic to fetch data for the selected period
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Grafik</h2>
                <DateDropdown onSelect={handlePeriodChange} />
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">Pendapatan</span>
                    </div>
                    <div className="text-xl font-bold text-[#00AB6B]">{formatCurrency(1500000)}</div>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">Pengeluaran</span>
                    </div>
                    <div className="text-xl font-bold text-[#FF6B6B]">{formatCurrency(1500000)}</div>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">Investasi</span>
                    </div>
                    <div className="text-xl font-bold text-[#FFB86B]">{formatCurrency(1500000)}</div>
                </div>
            </div>

            <div className="h-[300px] w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="2 2" stroke="#eee" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={formatYAxis}
                            tick={{ fontSize: 12 }}
                            dx={-10}
                            width={60}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white',
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                borderRadius: '8px',
                                padding: '8px 12px'
                            }}
                            formatter={(value) => [formatCurrency(value)]}
                            labelStyle={{ color: '#666' }}
                        />
                        <Line 
                            type="linear" 
                            dataKey="income" 
                            stroke="#00AB6B" 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                        <Line 
                            type="linear" 
                            dataKey="expense" 
                            stroke="#FF6B6B" 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                        <Line 
                            type="linear" 
                            dataKey="investment" 
                            stroke="#FFB86B" 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <button className="bg-[#00AB6B] text-white px-4 py-2 rounded-lg">Semua</button>
                    <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 cursor-pointer">Pendapatan</button>
                    <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 cursor-pointer">Pengeluaran</button>
                    <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 cursor-pointer">Lainnya</button>
                </div>
            </div>
        </div>
    );
}

export default ExpenseChart; 