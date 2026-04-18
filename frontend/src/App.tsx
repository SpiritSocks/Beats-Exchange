import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";
import { PlayerProvider } from "./context/PlayerContext";
import { CartProvider } from "./context/CartContext";
import { LikesProvider } from "./context/LikesContext";
import { FollowsProvider } from "./context/FollowsContext";
import { AuthProvider } from "./context/AuthContext";
import { PlayerBar } from "./components/PlayerBar";
import { Header } from "./components/Header";
import { SubNav } from "./components/SubNav";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import AllCategories from "./pages/AllCategories";
import ProducerDirectory from "./pages/ProducerDirectory";
import ProducerProfile from "./pages/ProducerProfile";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import GenreProfile from "./pages/GenreProfile";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="beat-exchange-theme">
        <TooltipProvider>
          <AuthProvider>
          <BrowserRouter>
            <CartProvider>
            <LikesProvider>
            <FollowsProvider>
            <PlayerProvider>
              <Toaster />
              <Header />
              <SubNav />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/categories" element={<AllCategories />} />
                <Route path="/genre/:id" element={<GenreProfile />} />
                <Route path="/producers" element={<ProducerDirectory />} />
                <Route path="/producers/:id" element={<ProducerProfile />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/search" element={<Search />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <PlayerBar />
            </PlayerProvider>
            </FollowsProvider>
            </LikesProvider>
            </CartProvider>
          </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
