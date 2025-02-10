import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import FidPage from "@/pages/fid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect } from "react";

function NoFID() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#6366F1] to-[#10B981] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
          BaseEdge Clanker Rank
        </h1>
        <Card className="max-w-xl mx-auto bg-white/10 border-none backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-4">No FID Provided</h3>
            <p className="text-white/80 mb-6">
              Please provide a Farcaster ID (FID) in the URL to view their profile and token holdings.
            </p>
            <Button
              onClick={() => setLocation("/fid/4003")}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              View Example Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/fid/:fid" component={FidPage} />
      <Route path="/fid" component={NoFID} />
      <Route path="*" component={() => {
        const [, setLocation] = useLocation();
        useEffect(() => {
          setLocation("/fid");
        }, [setLocation]);
        return null;
      }} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;