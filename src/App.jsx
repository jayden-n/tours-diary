import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Product from './pages/Product';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Homepage from './pages/Homepage';
import PageNotFound from './pages/PageNotFound';
import AppLayout from './pages/AppLayout';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='product' element={<Product />} />
        <Route path='pricing' element={<Pricing />} />
        <Route path='app' element={<AppLayout />}>
          <Route index element={<p>list of cities </p>} />
          <Route path='cities' element={<p>list of cities here</p>} />
          <Route path='countries' element={<p>list of countries here</p>} />
          <Route path='form' element={<p>list of FORMS here</p>} />
        </Route>
        <Route path='login' element={<Login />} />
        <Route index element={<Homepage />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
