import "./App.css";
import { useState, createContext, useEffect, useRef } from "react";
import clsx from "clsx";
import { LoadingScreen } from "./components/loadingscreen.jsx";
import { Background } from "./components/background.jsx";
import { MainDisplay } from "./components/maindisplay.jsx";
import { ShareScreen } from "./components/sharescreen.jsx";
import { InspirationScreen } from "./components/inspirationscreen.jsx";
import { PostScreen } from "./components/postScreen.jsx";
import { DashboardScreen } from "./components/dashboardScreen.jsx";

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
  const latestActiveScreen = useRef(null);

  useEffect(() => {
    latestActiveScreen.current = activeScreen;
  }, [activeScreen])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (latestActiveScreen.current) return;
      
      if (document.hidden) {
        setIsScrolling(false);
      } else {
        setIsScrolling(true);
      };
    };

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document,removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const displayClasses = () => {
    return clsx({
      "main-page": true,
      "enter-main": isEnterMain,
      "is-hiding-scrolling": hideScroll,
      "is-not-scrolling": !isScrolling,
      "share-screen-active": activeScreen === "share-screen",
      "inspiration-screen-active": activeScreen === "inspiration-screen",
      "post-screen-active": activeScreen === "post-screen",
      "dashboard-screen-active": activeScreen === "dashboard-screen"
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
          <DashboardScreen />
        </div>
      </States.Provider>
    </main>
  )
}

export {States};
