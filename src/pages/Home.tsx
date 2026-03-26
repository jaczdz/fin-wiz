import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Info } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="mb-10 text-center lg:text-left">
        <h1 className="text-4xl font-heading font-bold text-brand-blue tracking-tight">
          Witaj w FinWiz
        </h1>
        <p className="mt-3 text-lg text-slate-600 max-w-2xl">
          Twoje profesjonalne narzędzie do analizy wskaźników gospodarczych i świadomego zarządzania finansami.
        </p>
      </header>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Wczytywanie danych...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredIndicators.map((id) => {
            const info = INDICATORS_INFO[id];
            const indicatorData = data[id] || [];
            const latestData = indicatorData[indicatorData.length - 1];
            const param = info.parameters[0];
            const value = latestData ? latestData[param] : 0;

            return (
              <div key={id} className="bg-white rounded-xl shadow-sm border-t-4 border-brand-blue p-6 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-heading font-bold text-brand-blue">{info.name}</h3>
                  <TrendingUp className="w-5 h-5 text-brand-orange" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 mb-3 h-10 line-clamp-2">{info.fullName}</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-slate-900">{Number(value).toFixed(2)}%</span>
                    <span className="text-sm font-medium text-slate-500">({param})</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Ostatnia aktualizacja: {latestData?.date}
                  </p>
                </div>
                <Link
                  to={`/wskazniki/${id}`}
                  className="mt-6 inline-flex items-center text-sm font-medium text-brand-orange hover:text-brand-orange-hover transition-colors"
                >
                  Zobacz szczegóły
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm mt-12">
        <div className="flex items-start">
          <div className="bg-brand-light p-3 rounded-full mr-5">
            <Info className="w-6 h-6 text-brand-blue" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-brand-blue mb-4">
              Nowości w aplikacji
            </h2>
            <ul className="space-y-4 text-slate-700">
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-brand-orange mt-2 mr-3 flex-shrink-0" />
                <span><strong>Nowy wygląd:</strong> Odświeżyliśmy szatę graficzną, aby była bardziej przejrzysta i profesjonalna.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-brand-orange mt-2 mr-3 flex-shrink-0" />
                <span><strong>Rzeczywiste dane z plików CSV:</strong> Aplikacja korzysta teraz z wbudowanych plików CSV, co zapewnia dokładniejsze odwzorowanie historycznych wskaźników.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-brand-orange mt-2 mr-3 flex-shrink-0" />
                <span><strong>Średnie wartości w kalkulatorze:</strong> W zakładce Porównanie Kredytów wprowadziliśmy analizę średniego oprocentowania i średniej raty w wybranym okresie.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
