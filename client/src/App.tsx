import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Editor from "@/pages/Editor";
import Preview from "@/pages/Preview";
import Guide from "@/pages/Guide";
import AuthPage from "@/pages/auth-page";
import Projects from "@/pages/Projects";
import Layout from "@/components/Layout";
import { EditorProvider } from "./context/EditorContext";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/editor">
        <Editor />
      </ProtectedRoute>
      <ProtectedRoute path="/editor/:id">
        <Editor />
      </ProtectedRoute>
      <Route path="/preview/:id" component={Preview} />
      <Route path="/guide" component={Guide} />
      <ProtectedRoute path="/projects">
        <Projects />
      </ProtectedRoute>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EditorProvider>
          <Layout>
            <Router />
          </Layout>
          <Toaster />
        </EditorProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
