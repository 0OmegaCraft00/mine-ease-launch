import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Play, Square, Settings, Trash2, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ServerConfig, ServerStatus } from '@/types/server';
import minesosLogo from '@/assets/minesos-logo.png';

interface Server {
  id: string;
  name: string;
  ip: string;
  status: ServerStatus;
  config: ServerConfig;
  lastPlayed: Date;
}

interface ServerDashboardProps {
  onCreateServer: () => void;
  onImportServer: () => void;
  onManageServer: (server: Server) => void;
}

export const ServerDashboard = ({ onCreateServer, onImportServer, onManageServer }: ServerDashboardProps) => {
  const { t, language, setLanguage } = useLanguage();
  const [servers, setServers] = useState<Server[]>([]);

  useEffect(() => {
    // Load saved servers from localStorage
    const savedServers = localStorage.getItem('minesos-servers');
    if (savedServers) {
      setServers(JSON.parse(savedServers));
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hu' : 'en');
  };

  const getStatusColor = (status: ServerStatus) => {
    switch (status) {
      case 'running': return 'bg-gaming-success text-gaming-surface';
      case 'starting': return 'bg-gaming-warning text-gaming-surface';
      case 'stopping': return 'bg-gaming-warning text-gaming-surface';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: ServerStatus) => {
    switch (status) {
      case 'running': return 'Online';
      case 'starting': return 'Starting';
      case 'stopping': return 'Stopping';
      default: return 'Offline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={minesosLogo} alt="MinesOS Logo" className="w-12 h-12" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t.appTitle}</h1>
              <p className="text-muted-foreground">Minecraft Server Management Made Easy</p>
            </div>
          </div>
          <Button 
            variant="gaming-outline" 
            size="sm" 
            onClick={toggleLanguage}
            className="gap-2"
          >
            <Globe className="w-4 h-4" />
            {language.toUpperCase()}
          </Button>
        </div>

        {/* Main Actions */}
        {servers.length === 0 ? (
          <div className="text-center py-16 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Welcome to MinesOS</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Get started by creating a new Minecraft server or importing an existing one.
              </p>
            </div>
            
            <div className="flex justify-center gap-4">
              <Card className="bg-gaming-surface border-border shadow-elevated hover:shadow-glow transition-all cursor-pointer w-64" 
                    onClick={onCreateServer}>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Create Server</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Set up a new Minecraft server with custom configuration
                    </p>
                  </div>
                  <Button variant="gaming-primary" className="w-full">
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gaming-surface border-border shadow-elevated hover:shadow-glow transition-all cursor-pointer w-64" 
                    onClick={onImportServer}>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto flex items-center justify-center">
                    <Download className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Import Server</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Import an existing Minecraft server from your filesystem
                    </p>
                  </div>
                  <Button variant="secondary" className="w-full">
                    Import
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <>
            {/* Server Management Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Your Servers</h2>
              <div className="flex gap-2">
                <Button variant="gaming-outline" onClick={onImportServer} className="gap-2">
                  <Download className="w-4 h-4" />
                  Import
                </Button>
                <Button variant="gaming-primary" onClick={onCreateServer} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create
                </Button>
              </div>
            </div>

            {/* Server Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servers.map((server) => (
                <Card key={server.id} className="bg-gaming-surface border-border shadow-elevated hover:shadow-glow transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-foreground text-lg">{server.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{server.ip}</p>
                      </div>
                      <Badge className={getStatusColor(server.status)}>
                        {getStatusText(server.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Version</p>
                        <p className="text-foreground font-medium">{server.config.version}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Loader</p>
                        <p className="text-foreground font-medium capitalize">{server.config.loader}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">RAM</p>
                        <p className="text-foreground font-medium">{server.config.ramAllocation}GB</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Java</p>
                        <p className="text-foreground font-medium">{server.config.javaVersion}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {server.status === 'offline' ? (
                        <Button 
                          variant="gaming-success" 
                          size="sm" 
                          onClick={() => onManageServer(server)}
                          className="flex-1 gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Start
                        </Button>
                      ) : (
                        <Button 
                          variant="gaming-danger" 
                          size="sm" 
                          onClick={() => onManageServer(server)}
                          className="flex-1 gap-2"
                        >
                          <Square className="w-4 h-4" />
                          Stop
                        </Button>
                      )}
                      <Button 
                        variant="gaming-outline" 
                        size="sm" 
                        onClick={() => onManageServer(server)}
                        className="gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm pt-8 border-t border-border">
          <p>MinesOS Launcher v2.0.0 • {t.language}: {language === 'en' ? 'English' : 'Magyar'}</p>
        </div>
      </div>
    </div>
  );
};