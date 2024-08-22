import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Beranda from "./pages/Beranda";
import Nahwu from "./pages/Nahwu";
import NahwuTopik from "./pages/NahwuTopik";
import MateriNahwu from "./pages/MateriNahwu";
import KuisNahwu from "./pages/KuisNahwu";
import UjianNahwu from "./pages/UjianNahwu";
import Sharaf from "./pages/Sharaf";
import SharafTopik from "./pages/SharafTopik";
import MateriSharaf from "./pages/MateriSharaf";
import KuisSharaf from "./pages/KuisSharaf";
import UjianSharaf from "./pages/UjianSharaf";
import { CookiesProvider, useCookies } from "react-cookie";

function App() {
  const [cookies, setCookie] = useCookies(["user"]);
  function handleLogin(user) {
    setCookie("user", user.accessToken, { path: "/" });
  }
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login handleLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/beranda" element={<Beranda />} />
          <Route path="/nahwu/:id" element={<Nahwu />} />
          <Route path="/nahwutopik/:id" element={<NahwuTopik />} />
          <Route path="/materinahwu/:id" element={<MateriNahwu />} />
          <Route path="/kuisnahwu/:id" element={<KuisNahwu />} />
          <Route path="/ujiannahwu/:id" element={<UjianNahwu />} />
          <Route path="/sharaf/:id" element={<Sharaf />} />
          <Route path="/sharaftopik/:id" element={<SharafTopik />} />
          <Route path="/materisharaf/:id" element={<MateriSharaf />} />
          <Route path="/kuissharaf/:id" element={<KuisSharaf />} />
          <Route path="/ujiansharaf/:id" element={<UjianSharaf />} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
