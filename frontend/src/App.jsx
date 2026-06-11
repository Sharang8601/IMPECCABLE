import { AnimatePresence } from "framer-motion";
import AppRoutes from "./routes";

const App = () => {
  return (
    <AnimatePresence mode="wait">
      <AppRoutes />
    </AnimatePresence>
  );
};

export default App;