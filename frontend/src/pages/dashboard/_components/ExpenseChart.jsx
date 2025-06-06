import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartArea } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DateDropdown from './DateDropdown';
import LoadingSpinner from '../../../components/LoadingSpinner';

const generateRandomChartData = (base) => {
    return base.map(item => ({
        ...item,
        income: Math.round(item.income * (0.8 + Math.random() * 0.4)),
        expense: Math.round(item.expense * (0.8 + Math.random() * 0.4)),
    }));
};

const DUMMY_CHART_DATA_BASE = [
  { date: "01/05", income: 1500000, expense: 1200000 },
  { date: "05/05", income: 1800000, expense: 1400000 },
  { date: "10/05", income: 1600000, expense: 1100000 },
  { date: "15/05", income: 2000000, expense: 1600000 },
  { date: "20/05", income: 1900000, expense: 1300000 },
  { date: "25/05", income: 1700000, expense: 1500000 },
  { date: "30/05", income: 2100000, expense: 1250000 },
];

const DUMMY_DATA = {
  today: generateRandomChartData(DUMMY_CHART_DATA_BASE),
  last_week: generateRandomChartData(DUMMY_CHART_DATA_BASE),
  last_month: generateRandomChartData(DUMMY_CHART_DATA_BASE),
  "1_year": generateRandomChartData(DUMMY_CHART_DATA_BASE),
  all_time: generateRandomChartData(DUMMY_CHART_DATA_BASE),
};

const fetchExpenseChart = async (timeframe = 'today') => {
  console.log(`Fetching chart data for timeframe: ${timeframe}`);
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  return DUMMY_DATA[timeframe];
};

const formatCurrency = (value) => {
    if (value >= 1000000) {
        return `Rp${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
        return `Rp${(value / 1000).toFixed(0)}K`;
    }
    return `Rp${value}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const sortedPayload = [...payload].sort((a, b) => b.value - a.value);

    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200/50 text-sm">
        <p className="font-bold text-gray-800 mb-2">{label}</p>
        <div className="space-y-1">
          {sortedPayload.map((pld) => (
            <div key={pld.dataKey} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: pld.stroke }}></span>
                <span className="text-gray-600 capitalize">{pld.dataKey}</span>
              </div>
              <span className="font-semibold text-gray-900 ml-4">{formatCurrency(pld.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

function ExpenseChart() {
    const [timeframe, setTimeframe] = useState('today');
    const [visibility, setVisibility] = useState({
        income: true,
        expense: true,
    });
    const [activeFilter, setActiveFilter] = useState('All');

    const { data: chartData, isLoading, isError, error } = useQuery({
        queryKey: ['expenseChart', timeframe],
        queryFn: () => fetchExpenseChart(timeframe),
        staleTime: 5 * 60 * 1000,
        keepPreviousData: true,
    });

    const handleTimeframeChange = (selectedTimeframe) => {
        setTimeframe(selectedTimeframe);
    };

    const formatYAxis = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${value / 1000}K`;
        }
        return value;
    };

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        setVisibility({
            income: filter === 'All' || filter === 'Income',
            expense: filter === 'All' || filter === 'Expense',
        });
    };

    const getButtonClass = (filter) => {
        const baseClass = "px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 cursor-pointer";
        if (activeFilter === filter) {
            switch (filter) {
                case 'All':
                    return `${baseClass} bg-gray-700 text-white shadow`;
                case 'Income':
                    return `${baseClass} bg-[#00AB6B] text-white shadow`;
                case 'Expense':
                    return `${baseClass} bg-[#FF6B6B] text-white shadow`;
                case 'Investment':
                    return `${baseClass} bg-[#FFB86B] text-white shadow`;
            }
        }
        return `${baseClass} bg-transparent text-gray-600 hover:bg-gray-200`;
    };

    // if (isLoading && !chartData) {
    //     return (
    //         <div className="bg-white p-6 rounded-xl shadow-sm h-[458px] flex justify-center items-center">
    //             <LoadingSpinner />
    //         </div>
    //     );
    // }

    if (isError) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm h-[458px] flex justify-center items-center">
                <p className="text-red-500">Error loading data: {error.message}</p>
            </div>
        );
    }

    return (
        <div className={`bg-white p-6 rounded-xl shadow-sm transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
            <div className="flex justify-between items-center mb-6">
                <div className='flex justify-between gap-2'>
                    <ChartArea className="w-6 h-6 text-orange-300" />
                    <h2 className="text-xl font-bold text-gray-600">Analytics</h2>
                </div>
                <DateDropdown onSelect={handleTimeframeChange} />
            </div>

            {isLoading && (
              <div className="bg-white p-6 rounded-xl shadow-sm flex justify-center items-center">
                <LoadingSpinner />
              </div>
            )}

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                        data={chartData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={formatYAxis}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            dx={-10}
                            width={50}
                        />
                        <Tooltip 
                            cursor={{ stroke: '#00AB6B', strokeWidth: 1, strokeDasharray: '3 3' }}
                            content={<CustomTooltip />} 
                        />
                        {visibility.income && <Line 
                            type="linear" 
                            dataKey="income" 
                            stroke="#00AB6B" 
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 2, fill: '#00AB6B', stroke: '#fff' }}
                        />}
                        {visibility.expense && <Line 
                            type="linear" 
                            dataKey="expense" 
                            stroke="#FF6B6B" 
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 2, fill: '#FF6B6B', stroke: '#fff' }}
                        />}
                        {visibility.investment && <Line 
                            type="linear" 
                            dataKey="investment" 
                            stroke="#FFB86B" 
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 2, fill: '#FFB86B', stroke: '#fff' }}
                        />}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-center items-center mt-4">
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                    <button onClick={() => handleFilterClick('All')} className={getButtonClass('All')}>All</button>
                    <button onClick={() => handleFilterClick('Income')} className={getButtonClass('Income')}>Income</button>
                    <button onClick={() => handleFilterClick('Expense')} className={getButtonClass('Expense')}>Expense</button>
                </div>
            </div>
        </div>
    );
}

export default ExpenseChart; 