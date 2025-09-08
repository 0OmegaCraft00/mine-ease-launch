import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServerStatus, ServerStatusType } from '@/components/ServerStatus';
import { ResourceSlider } from '@/components/ResourceSlider';
import { VersionSelector } from '@/components/VersionSelector';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Play, Square, FolderOpen, Cpu, HardDrive, Monitor, Globe } from 'lucide-react';
import minesosLogo from '@/assets/minesos-logo.png';

export const MinesOSLauncher = () => {
  const { t, language, setLanguage } = useLanguage();
  const [serverStatus, setServerStatus] = useState<ServerStatusType>('offline');
  const [serverPath, setServerPath] = useState('/home/user/minecraft-server');
  const [selectedVersion, setSelectedVersion] = useState('1.21.4');
  const [ramAllocation, setRamAllocation] = useState(4);
  const [cpuCores, setCpuCores] = useState(4);

  const handleLaunch = () => {
    if (serverStatus === 'offline') {
      setServerStatus('starting');
      // Simulate server startup
      setTimeout(() => setServerStatus('running'), 2000);
    }
  };

  const handleStop = () => {
    if (serverStatus === 'running') {
      setServerStatus('stopping');
      // Simulate server shutdown
      setTimeout(() => setServerStatus('offline'), 1500);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hu' : 'en');
  };

  const gpuInfo = 'NVIDIA RTX 4070 - 12GB VRAM';

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
            <ServerStatus status={serverStatus} />
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
                  <Button variant="gaming-outline" size="sm">
                    {t.browse}
                  </Button>
                </div>
              </div>
              
              <VersionSelector 
                value={selectedVersion}
                onChange={setSelectedVersion}
              />
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
                {serverStatus === 'offline' && (
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
                
                {serverStatus === 'starting' && (
                  <Button variant="gaming-outline" size="xl" disabled className="w-full">
                    {t.starting}...
                  </Button>
                )}
                
                {serverStatus === 'running' && (
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
                
                {serverStatus === 'stopping' && (
                  <Button variant="gaming-outline" size="xl" disabled className="w-full">
                    {t.stopping}...
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {serverStatus === 'running' ? '24' : '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">Players</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {serverStatus === 'running' ? '19.2' : '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">TPS</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm">
          <p>MinesOS Launcher v1.0.0 • {t.language}: {language === 'en' ? 'English' : 'Magyar'}</p>
        </div>
      </div>
    </div>
  );
};