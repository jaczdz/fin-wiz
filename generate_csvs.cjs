const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function generateData(id, params, baseVal, volatility) {
  let csv = 'date,' + params.join(',') + '\n';
  let currentDate = new Date(2014, 0, 1);
  const endDate = new Date();
  let currentVals = params.map((_, i) => baseVal + i * 0.2);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Add some random walk
    currentVals = currentVals.map(v => {
      let newVal = v + (Math.random() - 0.5) * volatility;
      
      // 2022-2023 spike simulation
      const year = currentDate.getFullYear();
      if (year === 2022 || year === 2023) {
         newVal += Math.random() * 0.4;
      } else if (year > 2023) {
         newVal -= Math.random() * 0.2;
      }
      
      return Math.max(0.1, Number(newVal.toFixed(2)));
    });

    csv += `${dateStr},${currentVals.join(',')}\n`;
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  fs.writeFileSync(path.join(dir, `${id}.csv`), csv);
}

generateData('stopy', ['Referencyjna', 'Lombardowa', 'Depozytowa'], 1.5, 0.2);
generateData('inflacja', ['CPI r/r'], 2.0, 0.4);
generateData('wibor', ['1M', '3M', '6M'], 1.7, 0.2);
generateData('wiron', ['1M', '3M', '6M'], 1.6, 0.2);
generateData('wibid', ['1M', '3M', '6M'], 1.5, 0.2);
generateData('polstr', ['O/N'], 1.5, 0.2);
console.log('CSVs generated successfully.');
