import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { muiTheme } from "./theme";

import { ProtectedRoute } from "./utils/ProtectedRoute";
import { Login } from "./pages/Login";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { KPIs } from "./pages/KPIs";
import { Graphical } from "./pages/Graphical";
import { Advanced } from "./pages/Advanced";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>

              <Route path="/" element={<Landing />} />
              <Route path="/kpis" element={<KPIs />} />
              <Route path="/graphical" element={<Graphical />} />
              <Route path="/advanced" element={<Advanced />} />
              <Route path="*" element={<NotFound />} />

            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
