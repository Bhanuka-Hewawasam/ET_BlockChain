import { Route, Switch } from "wouter";
import { Toaster } from "sonner";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      <Toaster />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/upload" component={Home} />
        <Route path="/verify" component={Home} />
        <Route path="/history" component={Home} />
        <Route>404 - Page not found</Route>
      </Switch>
    </>
  );
}