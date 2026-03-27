import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Sparkles, BarChart3 } from 'lucide-react';
import { INDICATORS_INFO, fetchIndicatorData, type IndicatorDataPoint } from '../data/dataService';

export default function Home() {
  const featuredIndicators = ['wibor', 'inflacja', 'stopy'];
  const [data, setData] = useState<Record<string, IndicatorDataPoint[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(featuredIndicators.map(id => fetchIndicatorData(id).then(d => ({id, data: d}))))
      .then(results => {
        const newData: Record<string, IndicatorDataPoint[]> = {};
        results.forEach(r => newData[r.id] = r.data);
        setData(newData);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-10">
      <header className="max-w-3xl">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold tracking-wide uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          Nowa wersja 2.0
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight leading-[1.15]">
          Zrozum finanse z <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">FinWiz</span>
        </h1>
        <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-2xl">
          Twoje profesjonalne narzędzie do analizy wskaźników gospodarczych. Śledź trendy, analizuj dane i podejmuj świadome decyzje finansowe.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl h-64 border border-slate-100 shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredIndicators.map((id) => {
            const info = INDICATORS_INFO[id];
            const indicatorData = data[id] || [];
            const latestData = indicatorData[indicatorData.length - 1];
            const param = info.parameters[0];
            const value = latestData ? latestData[param] : 0;

            return (
              <div key={id} className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-display font-bold text-slate-900">{info.name}</h3>
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-slate-500 mb-4 h-10 line-clamp-2 leading-relaxed">{info.fullName}</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-display font-bold tracking-tight text-slate-900">
                      {Number(value).toFixed(2)}<span className="text-3xl text-slate-400 font-medium">%</span>
                    </span>
                  </div>
                  <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-50 text-xs font-medium text-slate-500 border border-slate-100">
                    Parametr: {param}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Aktualizacja: {latestData?.date}</span>
                  <Link
                    to={`/wskazniki/${id}`}
                    className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Analizuj
                    <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-2xl shadow-slate-900/20 mt-12">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-violet-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md">
            <BarChart3 className="w-8 h-8 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-white mb-3">
              Nowoczesna analityka finansowa
            </h2>
            <p className="text-slate-300 leading-relaxed max-w-3xl">
              Zaktualizowaliśmy interfejs, aby dostarczyć Ci narzędzie klasy premium. Czysty design, płynne animacje i precyzyjne dane z plików CSV pomogą Ci jeszcze lepiej zrozumieć rynek. Sprawdź nasz nowy kalkulator kredytowy, który teraz analizuje średnie wartości w czasie!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
