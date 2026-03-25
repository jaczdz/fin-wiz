import { addMonths, format, subYears } from 'date-fns';

export type IndicatorDataPoint = {
  date: string;
  value: number;
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
    description: 'Stopa referencyjna NBP określa minimalną rentowność 7-dniowych bonów pieniężnych emitowanych przez NBP. Jest to główna stopa procentowa wpływająca na koszt pieniądza na rynku międzybankowym.',
    parameters: ['Referencyjna', 'Lombardowa', 'Depozytowa']
  },
  inflacja: {
    id: 'inflacja',
    name: 'Inflacja (CPI)',
    fullName: 'Wskaźnik cen towarów i usług konsumpcyjnych (CPI)',
    description: 'Mierzy średnią zmianę cen towarów i usług nabywanych przez gospodarstwa domowe. Jest to najpopularniejsza miara inflacji w Polsce.',
    parameters: ['CPI r/r']
  },
  wibor: {
    id: 'wibor',
    name: 'WIBOR',
    fullName: 'Warsaw Interbank Offered Rate',
    description: 'Referencyjna wysokość oprocentowania pożyczek na polskim rynku międzybankowym. Na jej podstawie wyznaczane jest oprocentowanie większości kredytów hipotecznych w Polsce.',
    parameters: ['1M', '3M', '6M']
  },
  wiron: {
    id: 'wiron',
    name: 'WIRON',
    fullName: 'Warsaw Interest Rate Overnight',
    description: 'Wskaźnik referencyjny stopy procentowej oparty na transakcjach depozytowych zawieranych przez podmioty przekazujące dane z instytucjami finansowymi oraz dużymi przedsiębiorstwami. Ma zastąpić WIBOR.',
    parameters: ['1M', '3M', '6M']
  },
  wibid: {
    id: 'wibid',
    name: 'WIBID',
    fullName: 'Warsaw Interbank Bid Rate',
    description: 'Referencyjna wysokość oprocentowania depozytów na polskim rynku międzybankowym. Oznacza stopę, po jakiej banki są skłonne przyjąć depozyt od innych banków.',
    parameters: ['1M', '3M', '6M']
  },
  polstr: {
    id: 'polstr',
    name: 'POLSTR',
    fullName: 'Polish Sterling Overnight Index Average',
    description: 'Indeks mierzący średnią stopę procentową jednodniowych depozytów niezabezpieczonych na polskim rynku międzybankowym.',
    parameters: ['O/N']
  }
};

// Generate 10 years of monthly data
export function generateMockData(indicatorId: string): IndicatorDataPoint[] {
  const data: IndicatorDataPoint[] = [];
  const endDate = new Date();
  const startDate = subYears(endDate, 10);
  let currentDate = startDate;

  // Base values for simulation
  let baseValue = 1.5;
  if (indicatorId === 'inflacja') baseValue = 2.0;

  while (currentDate <= endDate) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const point: IndicatorDataPoint = { date: dateStr, value: 0 }; // value is a fallback

    // Add some random walk to base value
    baseValue += (Math.random() - 0.5) * 0.5;
    
    // Simulate the 2022-2023 spike
    const year = currentDate.getFullYear();
    if (year === 2022 || year === 2023) {
      baseValue += (Math.random() * 0.5);
      if (baseValue > 18 && indicatorId === 'inflacja') baseValue = 18;
      if (baseValue > 7 && indicatorId !== 'inflacja') baseValue = 7;
    } else if (year > 2023) {
      baseValue -= (Math.random() * 0.3);
      if (baseValue < 5) baseValue = 5;
    }

    if (baseValue < 0.1) baseValue = 0.1;

    const info = INDICATORS_INFO[indicatorId];
    if (info) {
      info.parameters.forEach((param, index) => {
        // Add slight variations for different parameters
        point[param] = Number((baseValue + (index * 0.2)).toFixed(2));
      });
    }

    data.push(point);
    currentDate = addMonths(currentDate, 1);
  }

  return data;
}

// Generate data for all indicators
export const MOCK_DATA: Record<string, IndicatorDataPoint[]> = {
  stopy: generateMockData('stopy'),
  inflacja: generateMockData('inflacja'),
  wibor: generateMockData('wibor'),
  wiron: generateMockData('wiron'),
  wibid: generateMockData('wibid'),
  polstr: generateMockData('polstr'),
};
