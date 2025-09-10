import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServerStatus, ServerStatusType } from '@/components/ServerStatus';
import { ResourceSlider } from '@/components/ResourceSlider';
import { VersionSelector } from '@/components/VersionSelector';
import { LoaderSelector, ServerLoader } from '@/components/LoaderSelector';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useServerManager } from '@/hooks/useServerManager';
import { Play, Square, FolderOpen, Cpu, HardDrive, Monitor, Globe, Package, Puzzle } from 'lucide-react';
import minesosLogo from '@/assets/minesos-logo.png';

export const MinesOSLauncher = () => {
  const { t, language, setLanguage } = useLanguage();
  const {
    status,
    config,
    javaVersions,
    logs,
    configureServer,
    startServer,
    stopServer,
    selectDirectory,
    getServerJars
  } = useServerManager();
  
  const [serverPath, setServerPath] = useState(config?.serverPath || '');
  const [selectedVersion, setSelectedVersion] = useState(config?.version || '1.21.4');
  const [selectedLoader, setSelectedLoader] = useState<ServerLoader>(config?.loader || 'vanilla');
  const [selectedJava, setSelectedJava] = useState(config?.javaVersion || '21');
  const [ramAllocation, setRamAllocation] = useState(config?.ramAllocation || 4);
  const [cpuCores, setCpuCores] = useState(config?.cpuCores || 4);
  const [availableJars, setAvailableJars] = useState<string[]>([]);

  const handleDirectorySelect = async () => {
    try {
      const path = await selectDirectory();
      if (path) {
        setServerPath(path);
        const jars = await getServerJars(path);
        setAvailableJars(jars);
      }
    } catch (error) {
      console.error('Failed to select directory:', error);
      alert('Failed to select directory. Please try again.');
    }
  };

  const handleLaunch = async () => {
    if (!serverPath) {
      alert('Please select a server directory first');
      return;
    }

    if (availableJars.length === 0) {
      alert('No server JAR files found in the selected directory');
      return;
    }

    try {
      const serverConfig = {
        serverPath,
        serverJar: availableJars[0], // Use first available JAR
        loader: selectedLoader as any,
        version: selectedVersion,
        javaVersion: selectedJava as any,
        ramAllocation,
        cpuCores,
        serverPort: 25565,
        maxPlayers: 20,
        difficulty: 'normal' as const,
        gamemode: 'survival' as const,
        onlineMode: true,
        whitelist: false,
        motd: 'A Minecraft Server powered by MinesOS'
      };

      await configureServer(serverConfig);
      await startServer();
    } catch (error) {
      console.error('Failed to launch server:', error);
      alert(`Failed to launch server: ${error}`);
    }
  };

  const handleStop = async () => {
    try {
      await stopServer();
    } catch (error) {
      console.error('Failed to stop server:', error);
      alert('Failed to stop server. Please try again.');
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hu' : 'en');
  };

  const gpuInfo = 'NVIDIA RTX 4070 - 12GB VRAM';

  // Check if current loader supports mods or plugins
  const supportsModBrowsing = ['neoforge', 'forge', 'fabric', 'quilt'].includes(selectedLoader);
  const supportsPluginBrowsing = ['bukkit', 'spigot', 'mohist', 'arclight', 'waterfall', 'bungeecord'].includes(selectedLoader);

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={minesosLogo} alt="MinesOS Logo" className="w-12 h-12" />
            <h1 className="text-3xl font-bold text-foreground">{t.appTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="gaming-outline" 
              size="sm" 
              onClick={toggleLanguage}
              className="gap-2"
            >
              <Globe className="w-4 h-4" />
              {language.toUpperCase()}
            </Button>
            <ServerStatus status={status} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Server Configuration */}
          <Card className="bg-gaming-surface border-border shadow-elevated">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-primary" />
                {t.serverConfiguration}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t.serverDirectory}
                </label>
                <div className="flex gap-2">
                  <Input 
                    value={serverPath} 
                    onChange={(e) => setServerPath(e.target.value)}
                    className="bg-gaming-surface-elevated border-border text-foreground flex-1"
                    placeholder="/path/to/server"
                  />
                  <Button variant="gaming-outline" size="sm" onClick={handleDirectorySelect}>
                    {t.browse}
                  </Button>
                </div>
              </div>
              
              <LoaderSelector
                value={selectedLoader}
                onChange={setSelectedLoader}
              />
              
              <VersionSelector 
                value={selectedVersion}
                onChange={setSelectedVersion}
                javaVersion={selectedJava}
                onJavaChange={setSelectedJava}
                availableJavaVersions={javaVersions}
              />

              {/* Mod/Plugin Browser Buttons */}
              {(supportsModBrowsing || supportsPluginBrowsing) && (
                <div className="pt-4 border-t border-border space-y-2">
                  <label className="text-sm font-medium text-foreground block">
                    {supportsModBrowsing ? t.modBrowser : t.pluginBrowser}
                  </label>
                  <div className="flex gap-2">
                    {supportsModBrowsing && (
                      <>
                        <Link to="/modrinth" className="flex-1">
                          <Button variant="gaming-outline" size="sm" className="w-full gap-2">
                            <Package className="w-4 h-4" />
                            Modrinth
                          </Button>
                        </Link>
                        <Link to="/curseforge" className="flex-1">
                          <Button variant="gaming-outline" size="sm" className="w-full gap-2">
                            <Package className="w-4 h-4" />
                            CurseForge
                          </Button>
                        </Link>
                      </>
                    )}
                    {supportsPluginBrowsing && (
                      <Link to="/plugins" className="flex-1">
                        <Button variant="gaming-outline" size="sm" className="w-full gap-2">
                          <Puzzle className="w-4 h-4" />
                          {t.pluginBrowser}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resource Management */}
          <Card className="bg-gaming-surface border-border shadow-elevated">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Cpu className="w-5 h-5 text-accent" />
                {t.resourceManagement}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ResourceSlider
                label={t.ramAllocation}
                value={ramAllocation}
                onChange={setRamAllocation}
                min={1}
                max={32}
                unit="GB"
              />
              
              <ResourceSlider
                label={t.cpuCores}
                value={cpuCores}
                onChange={setCpuCores}
                min={1}
                max={16}
                unit="cores"
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  {t.gpuInfo}
                </label>
                <Badge variant="outline" className="bg-gaming-surface-elevated border-border text-foreground">
                  {gpuInfo}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Server Control */}
          <Card className="bg-gaming-surface border-border shadow-elevated">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-gaming-success" />
                {t.serverControl}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                {status === 'offline' && (
                  <Button 
                    variant="gaming-success" 
                    size="xl" 
                    onClick={handleLaunch}
                    className="w-full gap-2"
                  >
                    <Play className="w-5 h-5" />
                    {t.launch}
                  </Button>
                )}
                
                {status === 'starting' && (
                  <Button variant="gaming-outline" size="xl" disabled className="w-full">
                    {t.starting}...
                  </Button>
                )}
                
                {status === 'running' && (
                  <Button 
                    variant="gaming-danger" 
                    size="xl" 
                    onClick={handleStop}
                    className="w-full gap-2"
                  >
                    <Square className="w-5 h-5" />
                    {t.stop}
                  </Button>
                )}
                
                {status === 'stopping' && (
                  <Button variant="gaming-outline" size="xl" disabled className="w-full">
                    {t.stopping}...
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {status === 'running' ? '24' : '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">Players</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {status === 'running' ? '19.2' : '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">TPS</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Server Console */}
        {logs.length > 0 && (
          <Card className="bg-gaming-surface border-border shadow-elevated">
            <CardHeader>
              <CardTitle className="text-foreground">Server Console</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/20 rounded-lg p-4 h-48 overflow-y-auto font-mono text-sm">
                {logs.map((log, index) => (
                  <div key={index} className="text-gaming-text-muted mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm space-y-2">
          <p>MinesOS Launcher v1.0.0 • {t.language}: {language === 'en' ? 'English' : 'Magyar'}</p>
          {serverPath && <p>Server: {serverPath}</p>}
          {availableJars.length > 0 && <p>JARs: {availableJars.join(', ')}</p>}
        </div>
      </div>
    </div>
  );
};