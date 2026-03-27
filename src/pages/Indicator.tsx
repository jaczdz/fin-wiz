import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea
} from 'recharts';
import { subMonths, subYears, isAfter, parseISO } from 'date-fns';
import { Info, Database } from 'lucide-react';
import { INDICATORS_INFO, fetchIndicatorData, type IndicatorDataPoint } from '../data/dataService';

type TimeRange = '1M' | '3M' | '6M' | '1Y' | '5Y' | 'MAX';

export default function Indicator() {
  const { id } = useParams<{ id: string }>();
  const [timeRange, setTimeRange] = useState<TimeRange>('5Y');
  const [customRange, setCustomRange] = useState<[number, number]>([0, 100]);
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  
  const [rawData, setRawData] = useState<IndicatorDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const info = id ? INDICATORS_INFO[id] : null;

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchIndicatorData(id).then(data => {
        setRawData(data);
        setLoading(false);
      });
    }
  }, [id]);

  const filteredData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];

    const latestDate = parseISO(rawData[rawData.length - 1].date);
    let startDate = parseISO(rawData[0].date);

    if (timeRange !== 'MAX') {
      switch (timeRange) {
        case '1M': startDate = subMonths(latestDate, 1); break;
        case '3M': startDate = subMonths(latestDate, 3); break;
        case '6M': startDate = subMonths(latestDate, 6); break;
        case '1Y': startDate = subYears(latestDate, 1); break;
        case '5Y': startDate = subYears(latestDate, 5); break;
      }
    }

    let data = rawData.filter(d => isAfter(parseISO(d.date), startDate) || d.date === rawData[rawData.length - 1].date);

    if (customRange[0] > 0 || customRange[1] < 100) {
      const startIndex = Math.floor((customRange[0] / 100) * (data.length - 1));
      const endIndex = Math.ceil((customRange[1] / 100) * (data.length - 1));
      data = data.slice(startIndex, endIndex + 1);
    }

    return data;
  }, [rawData, timeRange, customRange]);

  if (!info) return <div className="p-12 text-center text-slate-500 font-medium">Nie znaleziono wskaźnika.</div>;
  if (loading) return <div className="p-12 text-center text-slate-500 font-medium animate-pulse">Wczytywanie danych...</div>;
  if (rawData.length === 0) return <div className="p-12 text-center text-slate-500 font-medium">Brak danych dla tego wskaźnika.</div>;

  const latestData = rawData[rawData.length - 1];
  const colors = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];

  const handleZoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === null || refAreaLeft === null) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }

    const data = filteredData;
    let leftIndex = data.findIndex(d => d.date === refAreaLeft);
    let rightIndex = data.findIndex(d => d.date === refAreaRight);

    if (leftIndex > rightIndex) {
      [leftIndex, rightIndex] = [rightIndex, leftIndex];
    }

    const totalLen = rawData.length;
    const globalLeftIndex = rawData.findIndex(d => d.date === data[leftIndex].date);
    const globalRightIndex = rawData.findIndex(d => d.date === data[rightIndex].date);

    const newStartPct = (globalLeftIndex / (totalLen - 1)) * 100;
    const newEndPct = (globalRightIndex / (totalLen - 1)) * 100;

    setCustomRange([newStartPct, newEndPct]);
    setTimeRange('MAX');
    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold tracking-wide uppercase mb-4 border border-slate-200">
            <Database className="w-3.5 h-3.5 mr-1.5" />
            Dane stooq.pl
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight">{info.name}</h1>
          <h2 className="text-xl text-slate-500 mt-3 font-medium">{info.fullName}</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            {info.description}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {info.parameters.map((param, idx) => (
          <div key={param} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-full -z-10" />
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">{param}</p>
            <div className="flex items-baseline">
              <span className="text-4xl font-display font-bold text-slate-900 tracking-tight">
                {Number(latestData[param]).toFixed(2)}<span className="text-2xl text-slate-400 ml-1">%</span>
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400 mt-4">
              Stan na: <span className="text-slate-600">{latestData.date}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-6">
          <h3 className="text-xl font-display font-bold text-slate-900">Wykres historyczny</h3>
          
          {/* Time Range Filters */}
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 overflow-x-auto max-w-full">
            {(['1M', '3M', '6M', '1Y', '5Y', 'MAX'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => {
                  setTimeRange(range);
                  setCustomRange([0, 100]);
                }}
                className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap ${
                  timeRange === range && customRange[0] === 0 && customRange[1] === 100
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-[450px] w-full select-none">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              onMouseDown={(e) => e && setRefAreaLeft(e.activeLabel || null)}
              onMouseMove={(e) => e && refAreaLeft && setRefAreaRight(e.activeLabel || null)}
              onMouseUp={handleZoom}
            >
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
                tickFormatter={(val) => `${val}%`}
                domain={['auto', 'auto']}
                width={80}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                labelStyle={{ fontWeight: '700', color: '#0f172a', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}
                formatter={(value: number) => [`${value.toFixed(2)}%`]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '24px' }}
                iconType="circle"
              />
              
              {info.parameters.map((param, idx) => (
                <Line
                  key={param}
                  type="monotone"
                  dataKey={param}
                  name={param}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, fill: colors[idx % colors.length] }}
                  animationDuration={500}
                />
              ))}

              {refAreaLeft && refAreaRight ? (
                // @ts-expect-error recharts types are missing SVG props for ReferenceArea
                <ReferenceArea x1={refAreaLeft} x2={refAreaRight} fill="#4f46e5" fillOpacity={0.05} />
              ) : null}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Range Slider */}
        <div className="mt-12 px-4 max-w-3xl mx-auto">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            <span>{rawData[0]?.date}</span>
            <span>{rawData[rawData.length - 1]?.date}</span>
          </div>
          <div className="relative h-2.5 bg-slate-100 rounded-full border border-slate-200/50">
            <div 
              className="absolute h-full bg-indigo-500 rounded-full"
              style={{ left: `${customRange[0]}%`, right: `${100 - customRange[1]}%` }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={customRange[0]}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val < customRange[1]) {
                  setCustomRange([val, customRange[1]]);
                  setTimeRange('MAX');
                }
              }}
              className="absolute w-full h-full opacity-0 cursor-pointer pointer-events-auto z-20"
              style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={customRange[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > customRange[0]) {
                  setCustomRange([customRange[0], val]);
                  setTimeRange('MAX');
                }
              }}
              className="absolute w-full h-full opacity-0 cursor-pointer pointer-events-auto z-20"
              style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-[3px] border-indigo-500 rounded-full shadow-md pointer-events-none z-10 transition-transform hover:scale-110"
              style={{ left: `calc(${customRange[0]}% - 10px)` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-[3px] border-indigo-500 rounded-full shadow-md pointer-events-none z-10 transition-transform hover:scale-110"
              style={{ left: `calc(${customRange[1]}% - 10px)` }}
            />
          </div>
          <div className="flex items-center justify-center mt-6 text-xs font-medium text-slate-400 bg-slate-50 py-2 px-4 rounded-xl w-fit mx-auto border border-slate-100">
            <Info className="w-4 h-4 mr-2 text-slate-400" />
            Zaznacz obszar na wykresie lub użyj suwaka, aby przybliżyć
          </div>
        </div>
      </div>
    </div>
  );
}
