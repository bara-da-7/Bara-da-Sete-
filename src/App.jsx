import { StoreProvider } from "./store/useStore";
import Home from "./pages/Home";

export default function App() {
  return (
    <StoreProvider>
      <Home />
    </StoreProvider>
  );
}
