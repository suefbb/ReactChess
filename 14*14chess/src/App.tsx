import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Game from "./components/Game";
import OnBoardChooseTime from "./components/OBCT";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/onBoardGame" element={<Game />}/>
        <Route path="/onBoardTime" element={<OnBoardChooseTime />}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
