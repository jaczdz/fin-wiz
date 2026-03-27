import { BookOpen, LineChart, Calculator, Database } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full -z-10 opacity-70" />
        
        <div className="flex items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mr-5">
            <BookOpen className="w-7 h-7 text-indigo-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight">Dokumentacja</h1>
        </div>
        
        <p className="text-lg text-slate-500 mb-12 leading-relaxed max-w-2xl">
          Witaj w przewodniku po aplikacji FinWiz. Poniżej znajdziesz opis wszystkich dostępnych funkcjonalności oraz instrukcję, jak z nich korzystać.
        </p>

        <div className="space-y-16">
          {/* Section 1 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="bg-slate-50 p-3 rounded-xl mr-4 border border-slate-100">
                <LineChart className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900">Wskaźniki finansowe</h2>
            </div>
            <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
              <p className="leading-relaxed">
                Aplikacja umożliwia śledzenie kluczowych wskaźników makroekonomicznych i rynkowych, takich jak:
                Stopy procentowe, Inflacja, WIBOR, WIRON, WIBID oraz POLSTR.
              </p>
              <h3 className="text-xl font-semibold mt-8 mb-4">Jak korzystać z wykresów?</h3>
              <ul className="list-disc pl-5 space-y-3 marker:text-indigo-400">
                <li><strong>Wybór wskaźnika:</strong> Skorzystaj z menu bocznego, aby przejść do szczegółów wybranego wskaźnika.</li>
                <li><strong>Filtrowanie czasu:</strong> Nad wykresem znajdują się przyciski (1M, 3M, 6M, 1Y, 5Y, MAX) pozwalające na szybkie zawężenie widoku do wybranego okresu.</li>
                <li><strong>Przybliżanie (Zoom):</strong> Kliknij i przeciągnij myszką po obszarze wykresu, aby przybliżyć konkretny fragment.</li>
                <li><strong>Suwak zakresu:</strong> Pod wykresem znajduje się suwak, który pozwala na precyzyjne, ręczne ustawienie zakresu dat wyświetlanych na wykresie.</li>
              </ul>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="bg-slate-50 p-3 rounded-xl mr-4 border border-slate-100">
                <Calculator className="w-6 h-6 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900">Porównanie Kredytów</h2>
            </div>
            <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
              <p className="leading-relaxed">
                Narzędzie to pozwala na symulację i porównanie wysokości raty równej kredytu hipotecznego w zależności od wybranego wskaźnika referencyjnego (np. WIBOR 3M vs WIRON 1M) oraz marży banku.
              </p>
              <h3 className="text-xl font-semibold mt-8 mb-4">Instrukcja obsługi kalkulatora:</h3>
              <ol className="list-decimal pl-5 space-y-3 marker:text-emerald-500 marker:font-semibold">
                <li><strong>Parametry ogólne:</strong> Wprowadź kwotę kredytu oraz okres kredytowania (w latach).</li>
                <li><strong>Opcja 1 i Opcja 2:</strong> Dla każdej z opcji wybierz wskaźnik bazowy (np. WIBOR), jego parametr (np. 3M) oraz wpisz marżę banku (np. 2.0%).</li>
                <li><strong>Analiza wyników:</strong> Aplikacja automatycznie obliczy bieżącą ratę dla obu opcji i wyświetli je w panelach.</li>
                <li><strong>Średnie wartości:</strong> W sekcji podsumowania zobaczysz średnie oprocentowanie oraz średnią ratę w wybranym okresie (np. w ciągu ostatnich 5 lat). Pozwala to na długoterminową analizę kosztów kredytu.</li>
                <li><strong>Wykres historyczny:</strong> Dolny wykres prezentuje, jak kształtowałaby się rata Twojego kredytu w przeszłości przy założonych parametrach.</li>
              </ol>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="bg-slate-50 p-3 rounded-xl mr-4 border border-slate-100">
                <Database className="w-6 h-6 text-violet-500" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900">Źródło Danych</h2>
            </div>
            <div className="prose prose-slate max-w-none prose-p:text-slate-600">
              <p className="leading-relaxed">
                Aplikacja korzysta z danych pobranych z portalu <strong>stooq.pl</strong>. Dane są przechowywane w postaci wbudowanych plików CSV, co zapewnia szybkie ładowanie i stabilność działania aplikacji bez konieczności odpytywania zewnętrznych serwerów.
              </p>
              <div className="bg-slate-50 border-l-4 border-violet-500 p-6 mt-8 rounded-r-2xl">
                <p className="text-slate-700 text-sm leading-relaxed m-0">
                  <strong className="text-slate-900 block mb-2">Informacja techniczna:</strong> Pliki CSV znajdują się w katalogu <code className="bg-white px-2 py-1 rounded-md text-violet-600 border border-slate-200 font-mono text-xs">/public/data/</code>. Aplikacja automatycznie wczytuje i parsuje te pliki przy użyciu biblioteki PapaParse.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
