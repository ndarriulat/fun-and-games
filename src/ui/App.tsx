"use client";

import { useState } from "react";
import type { Mode } from "@/content/types";
import { DepsProvider, type AppDeps } from "./deps";
import { HomeScreen } from "./HomeScreen";
import { LanguageProvider } from "./language";
import { SettingsScreen } from "./SettingsScreen";
import { TalkScreen } from "./TalkScreen";
import { TriviaScreen } from "./TriviaScreen";

/** Puzzles is a v1.1 mode: Home shows it as coming soon. Halloween 2026: "halloween" is Halloween Talk. */
export type Screen = "home" | Exclude<Mode, "puzzles"> | "halloween" | "settings";

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
          {screen === "halloween" && <TalkScreen goHome={goHome} edition="halloween" />}
          {screen === "settings" && <SettingsScreen goHome={goHome} />}
        </div>
      </LanguageProvider>
    </DepsProvider>
  );
}
