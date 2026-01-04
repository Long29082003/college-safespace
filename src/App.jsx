import "./App.css";
import { useState, createContext } from "react";
import clsx from "clsx";
import { LoadingScreen } from "./components/loadingscreen.jsx";
import { Background } from "./components/background.jsx";
import { MainDisplay } from "./components/maindisplay.jsx";
import { ShareScreen } from "./components/sharescreen.jsx";

const States = createContext(null); 

export function App() {
  //? States
  const [isEnterMain, setIsEnterMain] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeScreen, setActiveScreen] = useState(null);

  const displayClasses = () => {
    return clsx({
      "main-page": true,
      "enter-main": isEnterMain,
      "is-not-scrolling": !isScrolling,
      "share-screen-active": activeScreen === "share-screen",
    })
  };

  const enterMain = () => {
    setIsEnterMain(true);
    setIsScrolling(true);
  };

  const buttonClicked = () => {
    setActiveScreen("share-screen");
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
          <ShareScreen />
        </div>
      </States.Provider>
    </main>
  )
}

export {States};
