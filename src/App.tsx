import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Indicator from './pages/Indicator';
import MortgageComparison from './pages/MortgageComparison';
import Documentation from './pages/Documentation';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="wskazniki/:id" element={<Indicator />} />
          <Route path="kalkulator" element={<MortgageComparison />} />
          <Route path="dokumentacja" element={<Documentation />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
