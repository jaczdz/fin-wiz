import { useState, useMemo, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { subMonths, subYears, isAfter, parseISO } from 'date-fns';
import { Calculator, Info, ArrowRightLeft } from 'lucide-react';
import { INDICATORS_INFO, fetchIndicatorData, type IndicatorDataPoint } from '../data/dataService';

type TimeRange = '1M' | '3M' | '6M' | '1Y' | '5Y' | 'MAX';

export default function MortgageComparison() {
  const [index1, setIndex1] = useState('wibor');
  const [param1, setParam1] = useState('3M');
  const [margin1, setMargin1] = useState(2.0);

  const [index2, setIndex2] = useState('wiron');
  const [param2, setParam2] = useState('1M');
  const [margin2, setMargin2] = useState(2.0);

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

  const calculateInstallment = (rate: number, amount: number, years: number) => {
    const monthlyRate = rate / 100 / 12;
    const totalMonths = years * 12;
    if (monthlyRate === 0) return amount / totalMonths;
    return (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  };

  const chartData = useMemo(() => {
    if (data1.length === 0 || data2.length === 0) return [];

    const latestDate = parseISO(data1[data1.length - 1].date);
    let startDate = parseISO(data1[0].date);

    if (timeRange !== 'MAX') {
      switch (timeRange) {
        case '1M': startDate = subMonths(latestDate, 1); break;
        case '3M': startDate = subMonths(latestDate, 3); break;
        case '6M': startDate = subMonths(latestDate, 6); break;
        case '1Y': startDate = subYears(latestDate, 1); break;
        case '5Y': startDate = subYears(latestDate, 5); break;
      }
    }

    const mergedData = [];
    let i = 0, j = 0;

    while (i < data1.length && j < data2.length) {
      const d1 = data1[i];
      const d2 = data2[j];

      if (d1.date === d2.date) {
        if (isAfter(parseISO(d1.date), startDate) || d1.date === data1[data1.length - 1].date) {
          const rate1 = Number(d1[param1]) + margin1;
          const rate2 = Number(d2[param2]) + margin2;
          mergedData.push({
            date: d1.date,
            rate1,
            rate2,
            installment1: calculateInstallment(rate1, loanAmount, loanYears),
            installment2: calculateInstallment(rate2, loanAmount, loanYears),
          });
        }
        i++; j++;
      } else if (d1.date < d2.date) {
        i++;
      } else {
        j++;
      }
    }
    return mergedData;
  }, [data1, data2, param1, param2, margin1, margin2, loanAmount, loanYears, timeRange]);

  const averages = useMemo(() => {
    if (chartData.length === 0) return { avgRate1: 0, avgRate2: 0, avgInst1: 0, avgInst2: 0 };
    
    const sum = chartData.reduce((acc, curr) => ({
      rate1: acc.rate1 + curr.rate1,
      rate2: acc.rate2 + curr.rate2,
      inst1: acc.inst1 + curr.installment1,
      inst2: acc.inst2 + curr.installment2,
    }), { rate1: 0, rate2: 0, inst1: 0, inst2: 0 });

    const len = chartData.length;
    return {
      avgRate1: sum.rate1 / len,
      avgRate2: sum.rate2 / len,
      avgInst1: sum.inst1 / len,
      avgInst2: sum.inst2 / len,
    };
  }, [chartData]);

  const currentData = chartData[chartData.length - 1];

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-wide uppercase mb-4 border border-indigo-100">
          <Calculator className="w-3.5 h-3.5 mr-1.5" />
          Kalkulator Kredytowy
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight">Porównanie Kredytów</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Sprawdź, jak wybór wskaźnika referencyjnego wpływa na wysokość Twojej raty. Porównaj historyczne koszty i średnie wartości dla różnych scenariuszy.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Parametry kredytu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Kwota kredytu (PLN)</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Okres kredytowania (lata)</label>
            <input
              type="number"
              value={loanYears}
              onChange={(e) => setLoanYears(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Option 1 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full -z-10" />
          <h3 className="text-xl font-display font-bold text-indigo-900 mb-6 flex items-center">
            <span className="w-3 h-3 rounded-full bg-indigo-500 mr-3" />
            Opcja 1
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Wskaźnik</label>
                <select
                  value={index1}
                  onChange={(e) => {
                    setIndex1(e.target.value);
                    setParam1(INDICATORS_INFO[e.target.value].parameters[0]);
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium appearance-none"
                >
                  {Object.entries(INDICATORS_INFO).map(([key, info]) => (
                    <option key={key} value={key}>{info.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Parametr</label>
                <select
                  value={param1}
                  onChange={(e) => setParam1(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium appearance-none"
                >
                  {INDICATORS_INFO[index1]?.parameters.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Marża banku (%)</label>
              <input
                type="number"
                step="0.1"
                value={margin1}
                onChange={(e) => setMargin1(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium"
              />
            </div>
          </div>
          
          {currentData && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Bieżąca rata</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-display font-bold text-indigo-600 tracking-tight">
                  {currentData.installment1.toFixed(2)}<span className="text-2xl text-indigo-300 ml-2">PLN</span>
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                Oprocentowanie: <span className="text-slate-900">{currentData.rate1.toFixed(2)}%</span>
              </p>
            </div>
          )}
        </div>

        {/* Option 2 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full -z-10" />
          <h3 className="text-xl font-display font-bold text-emerald-900 mb-6 flex items-center">
            <span className="w-3 h-3 rounded-full bg-emerald-500 mr-3" />
            Opcja 2
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Wskaźnik</label>
                <select
                  value={index2}
                  onChange={(e) => {
                    setIndex2(e.target.value);
                    setParam2(INDICATORS_INFO[e.target.value].parameters[0]);
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-900 font-medium appearance-none"
                >
                  {Object.entries(INDICATORS_INFO).map(([key, info]) => (
                    <option key={key} value={key}>{info.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Parametr</label>
                <select
                  value={param2}
                  onChange={(e) => setParam2(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-900 font-medium appearance-none"
                >
                  {INDICATORS_INFO[index2]?.parameters.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Marża banku (%)</label>
              <input
                type="number"
                step="0.1"
                value={margin2}
                onChange={(e) => setMargin2(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-900 font-medium"
              />
            </div>
          </div>

          {currentData && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Bieżąca rata</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-display font-bold text-emerald-600 tracking-tight">
                  {currentData.installment2.toFixed(2)}<span className="text-2xl text-emerald-300 ml-2">PLN</span>
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                Oprocentowanie: <span className="text-slate-900">{currentData.rate2.toFixed(2)}%</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-6">
            <h3 className="text-2xl font-display font-bold text-white">
              Podsumowanie okresu: <span className="text-indigo-400">{timeRange}</span>
            </h3>
            <div className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50 overflow-x-auto max-w-full backdrop-blur-md">
              {(['1M', '3M', '6M', '1Y', '5Y', 'MAX'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap ${
                    timeRange === range
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Średnie Oprocentowanie</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Opcja 1</p>
                  <p className="text-2xl font-display font-bold text-indigo-400">{averages.avgRate1.toFixed(2)}%</p>
                </div>
                <ArrowRightLeft className="w-5 h-5 text-slate-600" />
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">Opcja 2</p>
                  <p className="text-2xl font-display font-bold text-emerald-400">{averages.avgRate2.toFixed(2)}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Średnia Rata</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Opcja 1</p>
                  <p className="text-2xl font-display font-bold text-indigo-400">{averages.avgInst1.toFixed(0)} PLN</p>
                </div>
                <ArrowRightLeft className="w-5 h-5 text-slate-600" />
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">Opcja 2</p>
                  <p className="text-2xl font-display font-bold text-emerald-400">{averages.avgInst2.toFixed(0)} PLN</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-xl font-display font-bold text-slate-900 mb-8">Wykres wysokości raty w czasie</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
                tickMargin={12}
                minTickGap={40}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
                tickFormatter={(val) => `${val} zł`}
                domain={['auto', 'auto']}
                width={80}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                labelStyle={{ fontWeight: '700', color: '#0f172a', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(2)} PLN`, 
                  name === 'installment1' ? 'Rata Opcja 1' : 'Rata Opcja 2'
                ]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '24px' }}
                iconType="circle"
                formatter={(value) => value === 'installment1' ? 'Opcja 1' : 'Opcja 2'}
              />
              <Line 
                type="monotone" 
                dataKey="installment1" 
                name="installment1" 
                stroke="#4f46e5" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
              />
              <Line 
                type="monotone" 
                dataKey="installment2" 
                name="installment2" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
