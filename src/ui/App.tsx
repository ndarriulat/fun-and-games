"use client";

import { useState } from "react";
import type { Mode } from "@/content/types";
import type { HalloweenGame } from "./strings";
import { DepsProvider, type AppDeps } from "./deps";
import { HalloweenMenu } from "./HalloweenMenu";
import { HomeScreen } from "./HomeScreen";
import { LanguageProvider } from "./language";
import { CategoriesScreen } from "./CategoriesScreen";
import { SettingsScreen } from "./SettingsScreen";
import { SoundboardScreen } from "./SoundboardScreen";
import { TabooScreen } from "./TabooScreen";
import { TalkScreen } from "./TalkScreen";
import { TriviaScreen } from "./TriviaScreen";

/** Puzzles is a v1.1 mode: Home shows it as coming soon. Halloween 2026: "halloween" is the Halloween menu. */
export type Screen =
  | "home"
  | Exclude<Mode, "puzzles">
  | "halloween"
  | `halloween-${HalloweenGame}`
  | "halloween-sounds"
  | "settings";

/** The whole app. Its outside dependencies all come in through `deps`. */
export function App({ deps }: { deps: AppDeps }) {
  const [screen, setScreen] = useState<Screen>("home");
  const goHome = () => setScreen("home");
  // Halloween 2026: Halloween games go back to the Halloween menu, not Home.
  const goHalloween = () => setScreen("halloween");

  return (
    <DepsProvider deps={deps}>
      <LanguageProvider>
        <div className="app">
          {screen === "home" && <HomeScreen go={setScreen} />}
          {screen === "trivia" && <TriviaScreen goHome={goHome} />}
          {screen === "talk" && <TalkScreen goHome={goHome} />}
          {/* Halloween 2026 */}
          {screen === "halloween" && <HalloweenMenu go={setScreen} goHome={goHome} />}
          {screen === "halloween-talk" && <TalkScreen goHome={goHalloween} edition="halloween" />}
          {screen === "halloween-trivia" && <TriviaScreen goHome={goHalloween} edition="halloween" />}
          {screen === "halloween-taboo" && <TabooScreen goHome={goHalloween} />}
          {screen === "halloween-categories" && <CategoriesScreen goHome={goHalloween} />}
          {screen === "halloween-sounds" && <SoundboardScreen goHome={goHalloween} />}
          {screen === "settings" && <SettingsScreen goHome={goHome} />}
        </div>
      </LanguageProvider>
    </DepsProvider>
  );
}
