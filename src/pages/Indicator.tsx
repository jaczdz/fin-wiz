import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea
} from 'recharts';
import { subMonths, subYears, isAfter, parseISO } from 'date-fns';
import { Info } from 'lucide-react';
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

  if (!info) {
    return <div className="p-8 text-center text-slate-500">Nie znaleziono wskaźnika.</div>;
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Wczytywanie danych...</div>;
  }

  if (rawData.length === 0) {
    return <div className="p-8 text-center text-slate-500">Brak danych dla tego wskaźnika.</div>;
  }

  const latestData = rawData[rawData.length - 1];
  const colors = ['#003366', '#e67e22', '#10b981', '#ef4444'];

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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Info */}
      <div className="bg-white rounded-xl shadow-sm border-t-4 border-brand-blue p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-brand-blue">{info.name}</h1>
            <h2 className="text-lg text-slate-500 mt-1">{info.fullName}</h2>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-500 bg-brand-light px-4 py-2 rounded-lg border border-slate-200">
            <Info className="w-4 h-4 text-brand-blue" />
            <span>Źródło: stooq.pl (dane z plików CSV)</span>
          </div>
        </div>
        <p className="mt-6 text-slate-700 leading-relaxed max-w-3xl">
          {info.description}
        </p>
      </div>

      {/* Current Levels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {info.parameters.map((param, idx) => (
          <div key={param} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-brand-blue transition-colors">
            <p className="text-sm font-medium text-slate-500 mb-1">{param}</p>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-brand-blue">
                {Number(latestData[param]).toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Stan na: {latestData.date}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h3 className="text-xl font-heading font-bold text-brand-blue">Wykres historyczny</h3>
          
          {/* Time Range Filters */}
          <div className="flex bg-brand-light p-1 rounded-lg border border-slate-200">
            {(['1M', '3M', '6M', '1Y', '5Y', 'MAX'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => {
                  setTimeRange(range);
                  setCustomRange([0, 100]);
                }}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range && customRange[0] === 0 && customRange[1] === 100
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'text-slate-600 hover:text-brand-blue hover:bg-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-[400px] w-full select-none">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              onMouseDown={(e) => e && setRefAreaLeft(e.activeLabel || null)}
              onMouseMove={(e) => e && refAreaLeft && setRefAreaRight(e.activeLabel || null)}
              onMouseUp={handleZoom}
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
                tickFormatter={(val) => `${val}%`}
                domain={['auto', 'auto']}
                width={60}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#003366', marginBottom: '4px' }}
                formatter={(value: number) => [`${value.toFixed(2)}%`]}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              {info.parameters.map((param, idx) => (
                <Line
                  key={param}
                  type="monotone"
                  dataKey={param}
                  name={param}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={300}
                />
              ))}

              {refAreaLeft && refAreaRight ? (
                <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} fill="#003366" fillOpacity={0.1} />
              ) : null}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Range Slider */}
        <div className="mt-10 px-4">
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
            <span>{rawData[0]?.date}</span>
            <span>{rawData[rawData.length - 1]?.date}</span>
          </div>
          <div className="relative h-2 bg-slate-200 rounded-full">
            <div 
              className="absolute h-full bg-brand-blue rounded-full"
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
              className="absolute w-full h-2 opacity-0 cursor-pointer pointer-events-auto z-20"
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
              className="absolute w-full h-2 opacity-0 cursor-pointer pointer-events-auto z-20"
              style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-brand-blue rounded-full shadow pointer-events-none z-10"
              style={{ left: `calc(${customRange[0]}% - 8px)` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-brand-blue rounded-full shadow pointer-events-none z-10"
              style={{ left: `calc(${customRange[1]}% - 8px)` }}
            />
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">
            Zaznacz obszar na wykresie, aby przybliżyć. Użyj suwaka, aby ręcznie dostosować zakres.
          </p>
        </div>
      </div>
    </div>
  );
}
