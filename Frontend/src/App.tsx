import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouting from "./Routes/AppRouting";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouting />
    </QueryClientProvider>
  )
}

export default App
