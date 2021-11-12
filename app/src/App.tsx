import { useState, useEffect, useReducer } from "react";

import Logo from "./components/Logo";
import UrlForm from "./components/UrlForm";
import ShortUrlDisplay from "./components/ShortUrlDisplay";

interface InitialAppState {
  state: "initial";
  url: string;
  loading?: boolean;
  error: Error | null;
}

interface FinalAppState {
  state: "final";
  shortUrl: string;
  copied: boolean;
}

type AppState = InitialAppState | FinalAppState;

type AppAction =
  | { type: "SET_URL"; url: string }
  | { type: "URL_SUBMITTED" }
  | { type: "GOT_SLUG"; shortUrl: string }
  | { type: "CREATE_FAILED"; error: Error }
  | { type: "BACK_CLICKED" };

const initialState: InitialAppState = {
  state: "initial",
  url: "",
  error: null,
};

function App() {
  const [state, dispatch] = useReducer((state: AppState, action: AppAction) => {
    switch (action.type) {
      case "SET_URL":
        if (state.state !== "initial") {
          throw new Error(
            `Cannot handle action ${action.type} while in state '${state.state}'`
          );
        }

        return {
          ...state,
          url: action.url,
          error: null,
        };
      case "URL_SUBMITTED":
        if (state.state !== "initial") {
          throw new Error(
            `Cannot handle action ${action.type} while in state '${state.state}'`
          );
        }

        return {
          ...state,
          error: null,
          loading: true,
        };

      case "GOT_SLUG":
        if (state.state !== "initial") {
          throw new Error(
            `Cannot handle action ${action.type} while in state '${state.state}'`
          );
        }

        return {
          state: "final",
          shortUrl: action.shortUrl,
          copied: false,
        } as const;
      case "CREATE_FAILED":
        if (state.state !== "initial") {
          throw new Error(
            `Cannot handle action ${action.type} while in state '${state.state}'`
          );
        }

        return {
          ...state,
          loading: false,
          error: action.error,
        };
      case "BACK_CLICKED":
        if (state.state !== "final") {
          throw new Error(
            `Cannot handle action ${action.type} while in state '${state.state}'`
          );
        }

        return initialState;
    }
  }, initialState);

  const [darkMode, setDarkMode] = useState(
    () =>
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        "matchMedia" in window &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-200">
      <button
        className="i-heroicons-outline-moon dark:i-heroicons-outline-sun absolute top-1 right-1 p-2 hover:text-indigo-600 dark:hover:text-yellow-200"
        onClick={() => {
          const nextDarkMode = !darkMode;
          setDarkMode(nextDarkMode);
          localStorage.setItem("theme", nextDarkMode ? "dark" : "light");
        }}
        aria-label="Change theme"
      />

      <div className="max-w-[800px] mx-auto px-2 flex flex-col justify-center min-h-screen">
        <header className="mb-2">
          <Logo />
        </header>

        <main>
          {state.state === "initial" ? (
            <>
              <UrlForm
                url={state.url}
                onUrlChange={(url) => {
                  dispatch({ type: "SET_URL", url });
                }}
                onCreateFulfilled={(slug) => {
                  dispatch({
                    type: "GOT_SLUG",
                    shortUrl: `https://shortr-worker.twhitbeck.workers.dev/${slug}`,
                  });
                }}
                onCreateRejected={(error) => {
                  dispatch({ type: "CREATE_FAILED", error });
                }}
              />
              {state.error && (
                <p className="mt-2 text-red-700">
                  Sorry, there was an error. Please try again.
                </p>
              )}
            </>
          ) : state.state === "final" ? (
            <ShortUrlDisplay
              shortUrl={state.shortUrl}
              onBackClick={() => {
                dispatch({ type: "BACK_CLICKED" });
              }}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default App;
