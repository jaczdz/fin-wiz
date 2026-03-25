import { BookOpen, LineChart, Calculator, Upload } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center mb-6">
          <BookOpen className="w-8 h-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-slate-900">Dokumentacja i User Guide</h1>
        </div>
        <p className="text-lg text-slate-600 mb-8">
          Witaj w przewodniku po aplikacji FinWiz. Poniżej znajdziesz opis wszystkich dostępnych funkcjonalności oraz instrukcję, jak z nich korzystać.
        </p>

        <div className="space-y-12">
          {/* Section 1 */}
          <section>
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <LineChart className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">Wskaźniki finansowe</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                Aplikacja umożliwia śledzenie kluczowych wskaźników makroekonomicznych i rynkowych, takich jak:
                Stopy procentowe, Inflacja, WIBOR, WIRON, WIBID oraz POLSTR.
              </p>
              <h3 className="text-lg font-medium mt-4 mb-2">Jak korzystać z wykresów?</h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
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
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                <Calculator className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">Porównanie Kredytów</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                Narzędzie to pozwala na symulację i porównanie wysokości raty równej kredytu hipotecznego w zależności od wybranego wskaźnika referencyjnego (np. WIBOR 3M vs WIRON 1M) oraz marży banku.
              </p>
              <h3 className="text-lg font-medium mt-4 mb-2">Instrukcja obsługi kalkulatora:</h3>
              <ol className="list-decimal pl-5 space-y-2 text-slate-700">
                <li><strong>Parametry ogólne:</strong> Wprowadź kwotę kredytu oraz okres kredytowania (w latach).</li>
                <li><strong>Opcja 1 i Opcja 2:</strong> Dla każdej z opcji wybierz wskaźnik bazowy (np. WIBOR), jego parametr (np. 3M) oraz wpisz marżę banku (np. 2.0%).</li>
                <li><strong>Analiza wyników:</strong> Aplikacja automatycznie obliczy bieżącą ratę dla obu opcji i wyświetli je w panelach.</li>
                <li><strong>Podsumowanie zmian:</strong> W niebieskiej sekcji podsumowania zobaczysz, jak zmieniło się oprocentowanie i rata w wybranym okresie (np. w ciągu ostatnich 5 lat).</li>
                <li><strong>Wykres historyczny:</strong> Dolny wykres prezentuje, jak kształtowałaby się rata Twojego kredytu w przeszłości przy założonych parametrach.</li>
              </ol>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Section 3 */}
          <section>
            <div className="flex items-center mb-4">
              <div className="bg-amber-100 p-2 rounded-lg mr-3">
                <Upload className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">Źródło Danych</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                Domyślnie aplikacja korzysta z symulowanych danych historycznych w celach demonstracyjnych. 
                Docelowym źródłem danych jest portal <strong>stooq.pl</strong>.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-4">
                <p className="text-amber-800 text-sm">
                  <strong>Informacja:</strong> Obecnie funkcja automatycznego pobierania danych ze stooq.pl może być ograniczona ze względu na zabezpieczenia CORS. W przyszłych wersjach dodana zostanie opcja ręcznego wgrywania plików CSV pobranych bezpośrednio z portalu stooq.pl.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
