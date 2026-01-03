import "./App.css";
import { useState, createContext } from "react";
import clsx from "clsx";
import { LoadingScreen } from "./components/loadingscreen.jsx";
import { Background } from "./components/background.jsx";
import { MainDisplay } from "./components/maindisplay.jsx";

const States = createContext(null); 

export function App() {
  //? States
  const [isEnterMain, setIsEnterMain] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const displayClasses = () => {
    return clsx({
      "main-page": true,
      "enter-main": isEnterMain,
      "is-not-scrolling": !isScrolling,
    })
  };

  const enterMain = () => {
    setIsEnterMain(true);
    setIsScrolling(true);
  };

  const buttonClicked = () => {
    setIsScrolling(prev => !prev);
  };

  return (
    <main className = {displayClasses()}>
      <LoadingScreen 
        buttonOnClick = {enterMain}
      />
      <States.Provider value = {{isEnterMain, isScrolling, buttonClicked}}>
        <div className="main-screen">
          <Background />
          <MainDisplay />
        </div>
      </States.Provider>
    </main>
  )
}

export {States};
