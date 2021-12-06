import { Route } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";
import "./App.css";
function App() {
  return (
    <div className="App">
      <Route exact path="/" component={HomePage} />
      <Route path="/chats" component={ChatPage} />
    </div>
  );
}

export default App;
