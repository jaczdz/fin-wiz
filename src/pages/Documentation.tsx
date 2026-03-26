import { BookOpen, LineChart, Calculator, Database } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-sm border-t-4 border-brand-blue p-8">
        <div className="flex items-center mb-8">
          <BookOpen className="w-10 h-10 text-brand-orange mr-4" />
          <h1 className="text-4xl font-heading font-bold text-brand-blue">Dokumentacja i User Guide</h1>
        </div>
        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
          Witaj w przewodniku po aplikacji FinWiz. Poniżej znajdziesz opis wszystkich dostępnych funkcjonalności oraz instrukcję, jak z nich korzystać.
        </p>

        <div className="space-y-12">
          {/* Section 1 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="bg-brand-light p-3 rounded-lg mr-4 border border-slate-200">
                <LineChart className="w-6 h-6 text-brand-blue" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-brand-blue">Wskaźniki finansowe</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed">
                Aplikacja umożliwia śledzenie kluczowych wskaźników makroekonomicznych i rynkowych, takich jak:
                Stopy procentowe, Inflacja, WIBOR, WIRON, WIBID oraz POLSTR.
              </p>
              <h3 className="text-xl font-heading font-semibold mt-6 mb-4 text-brand-blue">Jak korzystać z wykresów?</h3>
              <ul className="list-disc pl-5 space-y-3 text-slate-700">
                <li><strong>Wybór wskaźnika:</strong> Skorzystaj z menu bocznego, aby przejść do szczegółów wybranego wskaźnika.</li>
                <li><strong>Filtrowanie czasu:</strong> Nad wykresem znajdują się przyciski (1M, 3M, 6M, 1Y, 5Y, MAX) pozwalające na szybkie zawężenie widoku do wybranego okresu.</li>
                <li><strong>Przybliżanie (Zoom):</strong> Kliknij i przeciągnij myszką po obszarze wykresu, aby przybliżyć konkretny fragment.</li>
                <li><strong>Suwak zakresu:</strong> Pod wykresem znajduje się suwak, który pozwala na precyzyjne, ręczne ustawienie zakresu dat wyświetlanych na wykresie.</li>
              </ul>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Section 2 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="bg-brand-light p-3 rounded-lg mr-4 border border-slate-200">
                <Calculator className="w-6 h-6 text-brand-orange" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-brand-blue">Porównanie Kredytów</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed">
                Narzędzie to pozwala na symulację i porównanie wysokości raty równej kredytu hipotecznego w zależności od wybranego wskaźnika referencyjnego (np. WIBOR 3M vs WIRON 1M) oraz marży banku.
              </p>
              <h3 className="text-xl font-heading font-semibold mt-6 mb-4 text-brand-blue">Instrukcja obsługi kalkulatora:</h3>
              <ol className="list-decimal pl-5 space-y-3 text-slate-700">
                <li><strong>Parametry ogólne:</strong> Wprowadź kwotę kredytu oraz okres kredytowania (w latach).</li>
                <li><strong>Opcja 1 i Opcja 2:</strong> Dla każdej z opcji wybierz wskaźnik bazowy (np. WIBOR), jego parametr (np. 3M) oraz wpisz marżę banku (np. 2.0%).</li>
                <li><strong>Analiza wyników:</strong> Aplikacja automatycznie obliczy bieżącą ratę dla obu opcji i wyświetli je w panelach.</li>
                <li><strong>Średnie wartości:</strong> W sekcji podsumowania zobaczysz średnie oprocentowanie oraz średnią ratę w wybranym okresie (np. w ciągu ostatnich 5 lat). Pozwala to na długoterminową analizę kosztów kredytu.</li>
                <li><strong>Wykres historyczny:</strong> Dolny wykres prezentuje, jak kształtowałaby się rata Twojego kredytu w przeszłości przy założonych parametrach.</li>
              </ol>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Section 3 */}
          <section>
            <div className="flex items-center mb-6">
              <div className="bg-brand-light p-3 rounded-lg mr-4 border border-slate-200">
                <Database className="w-6 h-6 text-brand-blue" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-brand-blue">Źródło Danych</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed">
                Aplikacja korzysta z danych pobranych z portalu <strong>stooq.pl</strong>. Dane są przechowywane w postaci wbudowanych plików CSV, co zapewnia szybkie ładowanie i stabilność działania aplikacji bez konieczności odpytywania zewnętrznych serwerów.
              </p>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
