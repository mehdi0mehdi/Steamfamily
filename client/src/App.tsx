import React from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";

// Simple hash location hook so the app uses #/ routes and GitHub Pages won't 404 on refresh.
function useHashLocation() {
  const getHash = () => (typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') || '/' : '/');
  const [loc, setLoc] = (React as any).useState(getHash());

  React.useEffect(() => {
    const onHash = () => setLoc(getHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (to: string) => {
    if (typeof window !== 'undefined') {
      window.location.hash = to;
      setLoc(to);
    }
  };

  return [loc, navigate];
}
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { Header } from "@/components/Header";
import Home from "@/pages/Home";
import ToolDetail from "@/pages/ToolDetail";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/not-found";

function AppRoutes() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tool/:slug" component={ToolDetail} />
        <Route path="/admin" component={Admin} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route component={NotFound} />
      </Switch>
      <footer className="border-t border-border bg-black">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">SteamFamily</h3>
              <p className="text-sm text-muted-foreground">
                Community gaming tools platform
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/" className="hover:text-foreground transition-colors" data-testid="link-footer-home">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-footer-privacy">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-foreground transition-colors" data-testid="link-footer-terms">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Community</h3>
              <p className="text-sm text-muted-foreground">
                Join our gaming community and share tools
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SteamFamily. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <WouterRouter hook={useHashLocation as any}>
            <AppRoutes />
          </WouterRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
