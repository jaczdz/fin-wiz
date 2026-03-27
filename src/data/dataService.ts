import Papa from 'papaparse';

export type IndicatorDataPoint = {
  date: string;
  [key: string]: string | number;
};

export type IndicatorInfo = {
  id: string;
  name: string;
  fullName: string;
  description: string;
  parameters: string[];
};

export const INDICATORS_INFO: Record<string, IndicatorInfo> = {
  stopy: {
    id: 'stopy',
    name: 'Stopy procentowe',
    fullName: 'Stopy procentowe NBP',
    description: 'Oficjalne stopy procentowe ustalane przez Radę Polityki Pieniężnej (RPP), określające rentowność instrumentów polityki pieniężnej NBP. Wpływają na poziom rynkowych stóp procentowych, a tym samym na oprocentowanie kredytów i depozytów w bankach komercyjnych.',
    parameters: ['Referencyjna', 'Lombardowa', 'Depozytowa']
  },
  inflacja: {
    id: 'inflacja',
    name: 'Inflacja (CPI)',
    fullName: 'Wskaźnik cen towarów i usług konsumpcyjnych (CPI)',
    description: 'Wskaźnik cen towarów i usług konsumpcyjnych (Consumer Price Index). Jest to podstawowa miara inflacji w Polsce, publikowana przez GUS, obrazująca średnią zmianę cen koszyka dóbr i usług nabywanych przez przeciętne gospodarstwo domowe.',
    parameters: ['CPI r/r']
  },
  wibor: {
    id: 'wibor',
    name: 'WIBOR',
    fullName: 'Warsaw Interbank Offered Rate',
    description: 'Warsaw Interbank Offered Rate – referencyjna stopa procentowa, po jakiej banki na polskim rynku międzybankowym udzielają sobie nawzajem niezabezpieczonych pożyczek w złotych. Stanowi podstawę oprocentowania większości kredytów o zmiennej stopie w Polsce.',
    parameters: ['1M', '3M', '6M']
  },
  wiron: {
    id: 'wiron',
    name: 'WIRON',
    fullName: 'Warsaw Interest Rate Overnight',
    description: 'Warsaw Interest Rate Overnight – wskaźnik referencyjny stopy procentowej oparty na rzeczywistych transakcjach depozytowych overnight zawieranych przez banki, instytucje finansowe oraz duże przedsiębiorstwa. Został wybrany jako wskaźnik mający zastąpić WIBOR.',
    parameters: ['1M', '3M', '6M']
  },
  wibid: {
    id: 'wibid',
    name: 'WIBID',
    fullName: 'Warsaw Interbank Bid Rate',
    description: 'Warsaw Interbank Bid Rate – referencyjna stopa procentowa, po jakiej banki na polskim rynku międzybankowym są skłonne przyjąć depozyty w złotych od innych banków.',
    parameters: ['1M', '3M', '6M']
  },
  polstr: {
    id: 'polstr',
    name: 'POLSTR',
    fullName: 'Polish Sterling Overnight Index Average',
    description: 'Polish Sterling Overnight Index Average – wskaźnik referencyjny mierzący średnią stopę procentową jednodniowych depozytów niezabezpieczonych w złotych na polskim rynku międzybankowym.',
    parameters: ['O/N']
  }
};

export function fetchIndicatorData(id: string): Promise<IndicatorDataPoint[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(`/data/${id}.csv`, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data as IndicatorDataPoint[]),
      error: (error) => reject(error)
    });
  });
}
