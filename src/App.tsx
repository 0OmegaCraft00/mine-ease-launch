import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ModrinthSearch } from "./pages/ModrinthSearch";
import { CurseForgeSearch } from "./pages/CurseForgeSearch";
import { CraftBukkitSearch } from "./pages/CraftBukkitSearch";
import { LanguageProvider } from "./contexts/LanguageContext";
import ServerManagement from "./pages/ServerManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/server/:id" element={<ServerManagement />} />
            <Route path="/modrinth" element={<ModrinthSearch />} />
            <Route path="/curseforge" element={<CurseForgeSearch />} />
            <Route path="/plugins" element={<CraftBukkitSearch />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
