import * as React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { AlertsProvider as OrigAlertsProvider } from "react-native-paper-alerts";
import { RecoilRoot } from "recoil";
import { LoadingComponent } from "./src/loading";
import { Main } from "./src/main";
import RecoilNexus from "recoil-nexus";

const AlertsProvider: React.FC<{ children: React.ReactNode }> =
  OrigAlertsProvider;

export default function App() {
  return (
    <React.Suspense fallback={<LoadingComponent />}>
      <RecoilRoot>
        <RecoilNexus />
        <PaperProvider>
          <AlertsProvider>
            <Main />
          </AlertsProvider>
        </PaperProvider>
      </RecoilRoot>
    </React.Suspense>
  );
}
