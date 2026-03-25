import { useState } from "react";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";

export default function App() {
  const [page, setPage] = useState("home");

  if (page === "checkout") {
    return <Checkout goBack={() => setPage("home")} />;
  }

  return <Home goCheckout={() => setPage("checkout")} />;
}
