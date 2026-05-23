import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/src/components/ui/toaster";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "../components/layout/Layout";
import ScrollToTop from "../components/ScrollToTop";
import { ENVS_VARIABLES } from "../lib/ENVS";

import Home from "./Home";
import About from "./About";
import Services from "./services/page";
import Projects from "./Projects";
import Government from "./government/page";
import Submit from "./submit/page";
import Admin from "./admin/page";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/services" component={Services} />
            <Route path="/projects" component={Projects} />
            <Route path="/government-review" component={Government} />
            <Route path="/government" component={Government} />
            <Route path="/submit" component={Submit} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={ENVS_VARIABLES.BASE_URL.replace(/\/$/, "")}>
          <ScrollToTop />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
