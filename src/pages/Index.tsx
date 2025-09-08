import { LanguageProvider } from '@/contexts/LanguageContext';
import { MinesOSLauncher } from '@/components/MinesOSLauncher';

const Index = () => {
  return (
    <LanguageProvider>
      <MinesOSLauncher />
    </LanguageProvider>
  );
};

export default Index;
