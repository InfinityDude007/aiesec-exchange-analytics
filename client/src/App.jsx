import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { muiTheme } from "./theme";

import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>

            <Route path='/' element={<Landing />}/>
            <Route path="*" element={<NotFound />} />

          </Routes>
        </Layout>
      </BrowserRouter>

    </ThemeProvider>
  );
};

export default App;
