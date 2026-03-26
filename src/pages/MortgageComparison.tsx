import { useState, useMemo, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { subMonths, subYears, isAfter, parseISO } from 'date-fns';
import { Calculator, Info } from 'lucide-react';
import { INDICATORS_INFO, fetchIndicatorData, type IndicatorDataPoint } from '../data/dataService';

type TimeRange = '1M' | '3M' | '6M' | '1Y' | '5Y' | 'MAX';

export default function MortgageComparison() {
  const [index1, setIndex1] = useState('wibor');
  const [param1, setParam1] = useState('3M');
  const [margin1, setMargin1] = useState(2.0);

  const [index2, setIndex2] = useState('wiron');
  const [param2, setParam2] = useState('1M');
  const [margin2, setMargin2] = useState(1.5);

  const [loanAmount, setLoanAmount] = useState(300000);
  const [loanYears, setLoanYears] = useState(25);
  const [timeRange, setTimeRange] = useState<TimeRange>('5Y');

  const [data1, setData1] = useState<IndicatorDataPoint[]>([]);
  const [data2, setData2] = useState<IndicatorDataPoint[]>([]);

  useEffect(() => {
    fetchIndicatorData(index1).then(setData1);
  }, [index1]);

  useEffect(() => {
    fetchIndicatorData(index2).then(setData2);
  }, [index2]);

  const calculateInstallment = (ratePercent: number, amount: number, years: number) => {
    const r = ratePercent / 100 / 12;
    const n = years * 12;
    if (r === 0) return amount / n;
    const q = 1 + r;
    return amount * Math.pow(q, n) * (q - 1) / (Math.pow(q, n) - 1);
  };

  const chartData = useMemo(() => {
    const mergedMap = new Map<string, any>();
    
    data1.forEach(d => {
      mergedMap.set(d.date, {
        date: d.date,
        rate1: Number(d[param1] || 0) + margin1,
        installment1: calculateInstallment(Number(d[param1] || 0) + margin1, loanAmount, loanYears)
      });
    });

    data2.forEach(d => {
      if (mergedMap.has(d.date)) {
        const existing = mergedMap.get(d.date);
        existing.rate2 = Number(d[param2] || 0) + margin2;
        existing.installment2 = calculateInstallment(Number(d[param2] || 0) + margin2, loanAmount, loanYears);
      }
    });

    let mergedData = Array.from(mergedMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    if (mergedData.length === 0) return [];

    const latestDate = parseISO(mergedData[mergedData.length - 1].date);
    let startDate = parseISO(mergedData[0].date);

    if (timeRange !== 'MAX') {
      switch (timeRange) {
        case '1M': startDate = subMonths(latestDate, 1); break;
        case '3M': startDate = subMonths(latestDate, 3); break;
        case '6M': startDate = subMonths(latestDate, 6); break;
        case '1Y': startDate = subYears(latestDate, 1); break;
        case '5Y': startDate = subYears(latestDate, 5); break;
      }
    }

    return mergedData.filter(d => isAfter(parseISO(d.date), startDate) || d.date === mergedData[mergedData.length - 1].date);
  }, [data1, param1, margin1, data2, param2, margin2, loanAmount, loanYears, timeRange]);

  const latestData = chartData.length > 0 ? chartData[chartData.length - 1] : null;

  const avgRate1 = chartData.length > 0 ? chartData.reduce((acc, d) => acc + d.rate1, 0) / chartData.length : 0;
  const avgInst1 = chartData.length > 0 ? chartData.reduce((acc, d) => acc + d.installment1, 0) / chartData.length : 0;
  const avgRate2 = chartData.length > 0 ? chartData.reduce((acc, d) => acc + d.rate2, 0) / chartData.length : 0;
  const avgInst2 = chartData.length > 0 ? chartData.reduce((acc, d) => acc + d.installment2, 0) / chartData.length : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border-t-4 border-brand-blue p-6">
        <div className="flex items-center mb-6">
          <Calculator className="w-8 h-8 text-brand-orange mr-3" />
          <div>
            <h1 className="text-3xl font-heading font-bold text-brand-blue">Porównanie Kredytów</h1>
            <p className="text-slate-500 text-sm mt-1">Porównaj wysokość raty w oparciu o różne wskaźniki i marże</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Global Settings */}
          <div className="space-y-4 col-span-1 md:col-span-3 lg:col-span-1 bg-brand-light p-5 rounded-lg border border-slate-200">
            <h3 className="font-heading font-bold text-brand-blue mb-4">Parametry kredytu</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kwota kredytu (PLN)</label>
              <input 
                type="number" 
                value={loanAmount}
                onChange={e => setLoanAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Okres kredytowania (lata)</label>
              <input 
                type="number" 
                value={loanYears}
                onChange={e => setLoanYears(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>

          {/* Option 1 */}
          <div className="space-y-4 bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-blue"></div>
            <h3 className="font-heading font-bold text-brand-blue mb-4">Opcja 1</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Wskaźnik</label>
                <select 
                  value={index1}
                  onChange={e => {
                    setIndex1(e.target.value);
                    setParam1(INDICATORS_INFO[e.target.value].parameters[0]);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  {Object.keys(INDICATORS_INFO).filter(k => k !== 'inflacja' && k !== 'stopy').map(k => (
                    <option key={k} value={k}>{INDICATORS_INFO[k].name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Parametr</label>
                <select 
                  value={param1}
                  onChange={e => setParam1(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  {INDICATORS_INFO[index1]?.parameters.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Marża banku (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={margin1}
                onChange={e => setMargin1(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            {latestData && (
              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Bieżące oprocentowanie:</span>
                  <span className="font-bold text-brand-blue">{latestData.rate1.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-500">Bieżąca rata:</span>
                  <span className="font-bold text-brand-blue">{latestData.installment1.toFixed(2)} PLN</span>
                </div>
              </div>
            )}
          </div>

          {/* Option 2 */}
          <div className="space-y-4 bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-orange"></div>
            <h3 className="font-heading font-bold text-brand-orange mb-4">Opcja 2</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Wskaźnik</label>
                <select 
                  value={index2}
                  onChange={e => {
                    setIndex2(e.target.value);
                    setParam2(INDICATORS_INFO[e.target.value].parameters[0]);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
                >
                  {Object.keys(INDICATORS_INFO).filter(k => k !== 'inflacja' && k !== 'stopy').map(k => (
                    <option key={k} value={k}>{INDICATORS_INFO[k].name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Parametr</label>
                <select 
                  value={param2}
                  onChange={e => setParam2(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
                >
                  {INDICATORS_INFO[index2]?.parameters.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Marża banku (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={margin2}
                onChange={e => setMargin2(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            {latestData && (
              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Bieżące oprocentowanie:</span>
                  <span className="font-bold text-brand-orange">{latestData.rate2.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-500">Bieżąca rata:</span>
                  <span className="font-bold text-brand-orange">{latestData.installment2.toFixed(2)} PLN</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Info */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-start">
          <div className="bg-brand-light p-3 rounded-full mr-5">
            <Info className="w-6 h-6 text-brand-blue" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-heading font-bold text-brand-blue mb-4">
              Średnie wartości w wybranym okresie ({timeRange})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-brand-light p-5 rounded-lg border border-slate-200">
                <h4 className="font-heading font-bold text-brand-blue mb-3">Opcja 1 ({INDICATORS_INFO[index1].name} {param1} + {margin1}%)</h4>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span>Średnie oprocentowanie:</span>
                    <span className="font-bold text-lg text-brand-blue">
                      {avgRate1.toFixed(2)}%
                    </span>
                  </li>
                  <li className="flex justify-between items-center pt-1">
                    <span>Średnia rata (dla {loanAmount.toLocaleString()} PLN):</span>
                    <span className="font-bold text-lg text-brand-blue">
                      {avgInst1.toFixed(2)} PLN
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-brand-light p-5 rounded-lg border border-slate-200">
                <h4 className="font-heading font-bold text-brand-orange mb-3">Opcja 2 ({INDICATORS_INFO[index2].name} {param2} + {margin2}%)</h4>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span>Średnie oprocentowanie:</span>
                    <span className="font-bold text-lg text-brand-orange">
                      {avgRate2.toFixed(2)}%
                    </span>
                  </li>
                  <li className="flex justify-between items-center pt-1">
                    <span>Średnia rata (dla {loanAmount.toLocaleString()} PLN):</span>
                    <span className="font-bold text-lg text-brand-orange">
                      {avgInst2.toFixed(2)} PLN
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h3 className="text-xl font-heading font-bold text-brand-blue">Wykres wysokości raty</h3>
          
          <div className="flex bg-brand-light p-1 rounded-lg border border-slate-200">
            {(['1M', '3M', '6M', '1Y', '5Y', 'MAX'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'text-slate-600 hover:text-brand-blue hover:bg-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickMargin={10}
                minTickGap={30}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickFormatter={(val) => `${val} zł`}
                domain={['auto', 'auto']}
                width={80}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#003366', marginBottom: '4px' }}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(2)} PLN`, 
                  name === 'installment1' ? `Opcja 1 (${INDICATORS_INFO[index1].name})` : `Opcja 2 (${INDICATORS_INFO[index2].name})`
                ]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => {
                  return value === 'installment1' 
                    ? `Opcja 1 (${INDICATORS_INFO[index1].name} ${param1} + ${margin1}%)` 
                    : `Opcja 2 (${INDICATORS_INFO[index2].name} ${param2} + ${margin2}%)`;
                }}
              />
              
              <Line
                type="monotone"
                dataKey="installment1"
                name="installment1"
                stroke="#003366"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="installment2"
                name="installment2"
                stroke="#e67e22"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
