import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Auth } from "./pages/auth";
import "./App.css";
import { dark } from "@clerk/themes";
import { TodoDashboard } from "./pages/todo-list-dashboard/todo-list-dashboard";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { TaskItemsProvider } from "./contexts/todo-item-context";

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="navbar">
          <SignedOut>
            <Navigate to={"/auth"}/>
          </SignedOut>
          <SignedIn>
            {/* <Link to={"/"}>Dashboard</Link> */}
            <UserButton showName appearance={{ baseTheme: dark }} />
          </SignedIn>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <TaskItemsProvider>
                <TodoDashboard />
              </TaskItemsProvider>
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
