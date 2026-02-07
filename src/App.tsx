import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import AllCategories from "./pages/AllCategories";
import ProducerDirectory from "./pages/ProducerDirectory";
import Auth from "./pages/Auth";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/categories" element={<AllCategories />} />
        <Route path="/producers" element={<ProducerDirectory />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} /> {/* Fallback to 404 */}
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="beat-exchange-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
