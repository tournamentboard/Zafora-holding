import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Maintenance from "./pages/Maintenance";
import { useGetSiteSettings } from "@workspace/api-client-react";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Government from "./pages/Government";
import Submit from "./pages/Submit";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Admin from "./pages/admin/Admin";

const queryClient = new QueryClient();

function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { data } = useGetSiteSettings("maintenance_mode");
  const { data: footerData } = useGetSiteSettings("footer");

  const mode = (() => {
    try { if (data?.value) return JSON.parse(data.value); } catch {}
    return null;
  })();

  const footerEmail = (() => {
    try { if (footerData?.value) return JSON.parse(footerData.value)?.email; } catch {}
    return "Office@zaforaholding.com";
  })();

  if (mode?.enabled) {
    return (
      <Maintenance
        headline={mode.headline}
        message={mode.message}
        estimatedTime={mode.estimatedTime}
        contactEmail={mode.showContactEmail ? footerEmail : undefined}
      />
    );
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route>
        <MaintenanceGate>
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/services" component={Services} />
              <Route path="/projects" component={Projects} />
              <Route path="/government-review" component={Government} />
              <Route path="/government" component={Government} />
              <Route path="/submit" component={Submit} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/terms" component={Terms} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </MaintenanceGate>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ScrollToTop />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
