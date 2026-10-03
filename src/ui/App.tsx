"use client";

import { useState } from "react";
import type { Mode } from "@/content/types";
import { DepsProvider, type AppDeps } from "./deps";
import { HomeScreen } from "./HomeScreen";
import { LanguageProvider } from "./language";
import { SettingsScreen } from "./SettingsScreen";
import { TalkScreen } from "./TalkScreen";
import { TriviaScreen } from "./TriviaScreen";

/** Puzzles is a v1.1 mode: Home shows it as coming soon. */
export type Screen = "home" | Exclude<Mode, "puzzles"> | "settings";

/** The whole app. Its outside dependencies all come in through `deps`. */
export function App({ deps }: { deps: AppDeps }) {
  const [screen, setScreen] = useState<Screen>("home");
  const goHome = () => setScreen("home");

  return (
    <DepsProvider deps={deps}>
      <LanguageProvider>
        <div className="app">
          {screen === "home" && <HomeScreen go={setScreen} />}
          {screen === "trivia" && <TriviaScreen goHome={goHome} />}
          {screen === "talk" && <TalkScreen goHome={goHome} />}
          {screen === "settings" && <SettingsScreen goHome={goHome} />}
        </div>
      </LanguageProvider>
    </DepsProvider>
  );
}
