import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Info } from 'lucide-react';
import { INDICATORS_INFO, MOCK_DATA } from '../data/mockData';

export default function Home() {
  const featuredIndicators = ['wibor', 'inflacja', 'stopy'];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Witaj w FinWiz
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Twoje narzędzie do pogłębiania wiedzy finansowej. Śledź i analizuj kluczowe wskaźniki gospodarcze.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredIndicators.map((id) => {
          const info = INDICATORS_INFO[id];
          const data = MOCK_DATA[id];
          const latestData = data[data.length - 1];
          const param = info.parameters[0];
          const value = latestData[param];

          return (
            <div key={id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{info.name}</h3>
                <TrendingUp className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 mb-2">{info.fullName}</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-slate-900">{value}%</span>
                  <span className="text-sm font-medium text-slate-500">({param})</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Ostatnia aktualizacja: {latestData.date}
                </p>
              </div>
              <Link
                to={`/wskazniki/${id}`}
                className="mt-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Zobacz szczegóły
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>

      <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-start">
          <Info className="w-6 h-6 text-indigo-600 mt-0.5 mr-4 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-indigo-900 mb-2">
              Nowości w aplikacji
            </h2>
            <ul className="space-y-3 text-indigo-800">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-2 flex-shrink-0" />
                <span><strong>Nowy kalkulator kredytowy:</strong> Porównaj raty kredytu hipotecznego w oparciu o różne wskaźniki (WIBOR vs WIRON) i marże banku.</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-2 flex-shrink-0" />
                <span><strong>Interaktywne wykresy:</strong> Dodaliśmy możliwość filtrowania zakresu dat (1M, 3M, 6M, 1Y, 5Y, MAX) oraz precyzyjny suwak do ręcznego wyboru okresu.</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-2 flex-shrink-0" />
                <span><strong>Import danych:</strong> Aplikacja korzysta z danych z portalu stooq.pl. Wkrótce dodamy możliwość ręcznego wgrywania plików CSV.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
