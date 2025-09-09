import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hu';

interface Translations {
  appTitle: string;
  serverConfiguration: string;
  serverDirectory: string;
  browse: string;
  version: string;
  selectVersion: string;
  loader: string;
  selectLoader: string;
  resourceManagement: string;
  ramAllocation: string;
  cpuCores: string;
  gpuInfo: string;
  serverControl: string;
  launch: string;
  stop: string;
  status: string;
  offline: string;
  starting: string;
  running: string;
  stopping: string;
  language: string;
  // Status messages
  serverOffline: string;
  serverStarting: string;
  serverRunning: string;
  serverStopping: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'MinesOS Launcher',
    serverConfiguration: 'Server Configuration',
    serverDirectory: 'Server Directory',
    browse: 'Browse',
    version: 'Version',
    selectVersion: 'Select Version',
    loader: 'Server Type',
    selectLoader: 'Select Server Type',
    resourceManagement: 'Resource Management',
    ramAllocation: 'RAM Allocation',
    cpuCores: 'CPU Cores',
    gpuInfo: 'GPU Info',
    serverControl: 'Server Control',
    launch: 'Launch Server',
    stop: 'Stop Server',
    status: 'Status',
    offline: 'Offline',
    starting: 'Starting',
    running: 'Running',
    stopping: 'Stopping',
    language: 'Language',
    serverOffline: 'Server is offline',
    serverStarting: 'Server is starting...',
    serverRunning: 'Server is running',
    serverStopping: 'Server is stopping...',
  },
  hu: {
    appTitle: 'MinesOS Indító',
    serverConfiguration: 'Szerver Konfiguráció',
    serverDirectory: 'Szerver Könyvtár',
    browse: 'Tallózás',
    version: 'Verzió',
    selectVersion: 'Verzió Kiválasztása',
    loader: 'Szerver Típus',
    selectLoader: 'Szerver Típus Kiválasztása',
    resourceManagement: 'Erőforrás Kezelés',
    ramAllocation: 'RAM Foglalás',
    cpuCores: 'CPU Magok',
    gpuInfo: 'GPU Információ',
    serverControl: 'Szerver Vezérlés',
    launch: 'Szerver Indítása',
    stop: 'Szerver Leállítása',
    status: 'Állapot',
    offline: 'Offline',
    starting: 'Indítás',
    running: 'Fut',
    stopping: 'Leállítás',
    language: 'Nyelv',
    serverOffline: 'A szerver offline',
    serverStarting: 'A szerver indul...',
    serverRunning: 'A szerver fut',
    serverStopping: 'A szerver leáll...',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};