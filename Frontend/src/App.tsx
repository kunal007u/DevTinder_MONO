import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouting from "./Routes/AppRouting";
import { Provider } from "react-redux";
import store from "./Store/store";

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>

        <AppRouting />
      </Provider>
    </QueryClientProvider>
  )
}

export default App
