import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { RaffleContextProvider } from "./contexts/RaffleContext";
import { Coupons } from "./pages/Coupons";
import { Dashboard } from "./pages/Dashboard";

function App() {


  return (
    <RaffleContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Coupons />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Coupons" element={<Coupons />} />
          <Route path="*" element={<h1>404: page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </RaffleContextProvider>
  );
}

export default App;