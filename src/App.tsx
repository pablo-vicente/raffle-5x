import {
  HashRouter,
  Route,
  Routes,
} from "react-router-dom";
import { RaffleContextProvider } from "./contexts/RaffleContext";
import { Coupons } from "./pages/Coupons";
import { Dashboard } from "./pages/Dashboard";

export enum Page {
  Coupons = "Coupons",
  Dashboard = "Dashboard",
}

function App() {


  return (
    <RaffleContextProvider>
      <HashRouter>
        <Routes>
          <Route path="/" index element={<Coupons />} />
          <Route path={Page.Dashboard} element={<Dashboard />} />
          <Route path={Page.Coupons} element={<Coupons />} />
          <Route path="*" element={<h1>404: page not found</h1>} />
        </Routes>
      </HashRouter>
    </RaffleContextProvider>
  );
}

export default App;