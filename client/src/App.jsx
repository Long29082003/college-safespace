import "./App.css";
import { useState, createContext, useEffect } from "react";
import clsx from "clsx";
import { LoadingScreen } from "./components/loadingscreen.jsx";
import { Background } from "./components/background.jsx";
import { MainDisplay } from "./components/maindisplay.jsx";
import { ShareScreen } from "./components/sharescreen.jsx";
import { InspirationScreen } from "./components/inspirationscreen.jsx";
import { PostScreen } from "./components/postScreen.jsx";

const States = createContext(null); 

export function App() {
  //? States
  const [isEnterMain, setIsEnterMain] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hideScroll, setHideScroll] = useState(true);
  const [activeScreen, setActiveScreen] = useState(null);
  const [activePostInPostScreen, setActivePostInPostScreen] = useState({
                                                                  id: null,
                                                                  name: "",
                                                                  recipient: "",
                                                                  feelings: "[]",
                                                                  message: "",
                                                                  created_at: "" 
                                                              });

  //? useEffect to check if user tab out;
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsScrolling(false);
      } else {
        setIsScrolling(true);
      };
    };

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {};
  }, []);

  const displayClasses = () => {
    return clsx({
      "main-page": true,
      "enter-main": isEnterMain,
      "is-hiding-scrolling": hideScroll,
      "is-not-scrolling": !isScrolling,
      "share-screen-active": activeScreen === "share-screen",
      "inspiration-screen-active": activeScreen === "inspiration-screen",
      "post-screen-active": activeScreen === "post-screen"
    })
  };

  const enterMain = () => {
    setHideScroll(false);
    setIsEnterMain(true);
    setIsScrolling(true);
  };

  const setAppStates = (hideScrollState, scrollingState, activeScreenState, newActivePostInPostScreen = null) => {
    setHideScroll(hideScrollState);
    setIsScrolling(scrollingState);
    setActiveScreen(activeScreenState);
    if (newActivePostInPostScreen) setActivePostInPostScreen(newActivePostInPostScreen);
  };

  return (
    <main className = {displayClasses()}>
      <LoadingScreen 
        buttonOnClick = {enterMain}
      />
      <States.Provider value = {{isEnterMain, isScrolling, setAppStates, activePostInPostScreen}}>
        <div className="main-screen">
          <Background />
          <MainDisplay />
          <ShareScreen />
          <InspirationScreen />
          <PostScreen />
        </div>
      </States.Provider>
    </main>
  )
}

export {States};
