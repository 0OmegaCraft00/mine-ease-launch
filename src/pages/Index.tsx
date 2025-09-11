import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServerDashboard } from '@/components/ServerDashboard';
import { ServerCreationWizard } from '@/components/ServerCreationWizard';
import { ServerImportDialog } from '@/components/ServerImportDialog';
import { ServerConfig } from '@/types/server';

type AppState = 'dashboard' | 'create' | 'import';

const Index = () => {
  const [currentView, setCurrentView] = useState<AppState>('dashboard');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const navigate = useNavigate();

  const handleCreateServer = () => {
    setCurrentView('create');
  };

  const handleImportServer = () => {
    setShowImportDialog(true);
  };

  const handleServerCreated = (config: ServerConfig) => {
    // Navigate back to dashboard and show the new server
    setCurrentView('dashboard');
    // Force refresh of the component to show new server
    window.location.reload();
  };

  const handleServerImported = (config: ServerConfig) => {
    // Navigate back to dashboard and show the imported server
    setCurrentView('dashboard');
    // Force refresh of the component to show imported server
    window.location.reload();
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleManageServer = (server: any) => {
    // Navigate to server management page
    navigate(`/server/${server.id}`);
  };

  if (currentView === 'create') {
    return (
      <ServerCreationWizard 
        onBack={handleBackToDashboard} 
        onComplete={handleServerCreated}
      />
    );
  }

  return (
    <>
      <ServerDashboard 
        onCreateServer={handleCreateServer}
        onImportServer={handleImportServer}
        onManageServer={handleManageServer}
      />
      <ServerImportDialog 
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleServerImported}
      />
    </>
  );
};

export default Index;
