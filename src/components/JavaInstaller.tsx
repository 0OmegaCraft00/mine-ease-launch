import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Coffee, Download, CheckCircle, AlertCircle, Cpu } from 'lucide-react';
import { JavaVersion } from '@/types/server';

interface JavaInstallation {
  version: JavaVersion;
  path: string;
  vendor: string;
  architecture: string;
  isInstalled: boolean;
}

interface JavaInstallerProps {
  isOpen: boolean;
  onClose: () => void;
  availableVersions: JavaVersion[];
  installedVersions: JavaInstallation[];
  onInstall: (version: JavaVersion) => Promise<void>;
  onUninstall: (version: JavaVersion) => Promise<void>;
}

export const JavaInstaller = ({
  isOpen,
  onClose,
  availableVersions,
  installedVersions,
  onInstall,
  onUninstall
}: JavaInstallerProps) => {
  const [installProgress, setInstallProgress] = useState<Record<JavaVersion, number>>({} as Record<JavaVersion, number>);
  const [installing, setInstalling] = useState<Record<JavaVersion, boolean>>({} as Record<JavaVersion, boolean>);
  const [installStatus, setInstallStatus] = useState<Record<JavaVersion, 'idle' | 'downloading' | 'installing' | 'complete' | 'error'>>({} as Record<JavaVersion, 'idle' | 'downloading' | 'installing' | 'complete' | 'error'>);

  const getJavaInfo = (version: JavaVersion) => {
    const info = {
      '8': { name: 'Java 8 (LTS)', description: 'For legacy Minecraft versions (1.16 and older)', minecraftVersions: '< 1.17' },
      '16': { name: 'Java 16', description: 'For Minecraft 1.17', minecraftVersions: '1.17' },
      '17': { name: 'Java 17 (LTS)', description: 'For Minecraft 1.18-1.20.4', minecraftVersions: '1.18 - 1.20.4' },
      '21': { name: 'Java 21 (LTS)', description: 'For Minecraft 1.21+', minecraftVersions: '1.21+' }
    };
    return info[version];
  };

  const isInstalled = (version: JavaVersion) => {
    return installedVersions.some(install => install.version === version && install.isInstalled);
  };

  const getInstallation = (version: JavaVersion) => {
    return installedVersions.find(install => install.version === version);
  };

  const handleInstall = async (version: JavaVersion) => {
    setInstalling(prev => ({ ...prev, [version]: true }));
    setInstallStatus(prev => ({ ...prev, [version]: 'downloading' }));
    setInstallProgress(prev => ({ ...prev, [version]: 0 }));

    try {
      // Simulate download progress
      for (let i = 0; i <= 50; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setInstallProgress(prev => ({ ...prev, [version]: i }));
      }

      setInstallStatus(prev => ({ ...prev, [version]: 'installing' }));

      // Simulate installation progress
      for (let i = 50; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setInstallProgress(prev => ({ ...prev, [version]: i }));
      }

      await onInstall(version);
      setInstallStatus(prev => ({ ...prev, [version]: 'complete' }));
    } catch (error) {
      setInstallStatus(prev => ({ ...prev, [version]: 'error' }));
      console.error('Failed to install Java:', error);
    } finally {
      setInstalling(prev => ({ ...prev, [version]: false }));
    }
  };

  const handleUninstall = async (version: JavaVersion) => {
    try {
      await onUninstall(version);
      setInstallStatus(prev => ({ ...prev, [version]: 'idle' }));
      setInstallProgress(prev => ({ ...prev, [version]: 0 }));
    } catch (error) {
      console.error('Failed to uninstall Java:', error);
    }
  };

  const getStatusColor = (version: JavaVersion) => {
    const status = installStatus[version];
    switch (status) {
      case 'complete':
        return 'text-gaming-success';
      case 'error':
        return 'text-gaming-danger';
      case 'downloading':
      case 'installing':
        return 'text-gaming-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (version: JavaVersion) => {
    const status = installStatus[version];
    const isVersionInstalled = isInstalled(version);

    if (isVersionInstalled && status !== 'error') {
      return <CheckCircle className="w-4 h-4 text-gaming-success" />;
    }

    switch (status) {
      case 'downloading':
      case 'installing':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-gaming-warning border-t-transparent" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-gaming-danger" />;
      default:
        return <Coffee className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gaming-surface border-border max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Coffee className="w-5 h-5 text-primary" />
            Java Runtime Manager
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 animate-fade-in">
          <div className="text-sm text-muted-foreground mb-4">
            Manage Java installations for different Minecraft versions. Each version requires specific Java versions for optimal compatibility.
          </div>

          {availableVersions.map((version) => {
            const javaInfo = getJavaInfo(version);
            const installation = getInstallation(version);
            const isVersionInstalled = isInstalled(version);
            const isVersionInstalling = installing[version];
            const status = installStatus[version];
            const progress = installProgress[version] || 0;

            return (
              <Card key={version} className="bg-gaming-surface-elevated border-border animate-slide-in-right">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(version)}
                      <div>
                        <CardTitle className="text-base text-foreground">{javaInfo.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{javaInfo.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-gaming-surface border-border">
                      {javaInfo.minecraftVersions}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {installation && isVersionInstalled && (
                    <div className="p-3 bg-gaming-surface rounded-lg animate-scale-bounce">
                      <div className="flex items-center gap-2 mb-1">
                        <Cpu className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Installation Details</span>
                      </div>
                      <div className="text-xs space-y-1 text-muted-foreground">
                        <p><strong>Path:</strong> {installation.path}</p>
                        <p><strong>Vendor:</strong> {installation.vendor}</p>
                        <p><strong>Architecture:</strong> {installation.architecture}</p>
                      </div>
                    </div>
                  )}

                  {(status === 'downloading' || status === 'installing') && (
                    <div className="space-y-2 animate-pulse-glow">
                      <div className="flex justify-between text-sm">
                        <span className={getStatusColor(version)}>
                          {status === 'downloading' ? 'Downloading Java runtime...' : 'Installing Java runtime...'}
                        </span>
                        <span className="text-muted-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="p-3 bg-gaming-danger/10 border border-gaming-danger rounded-lg animate-scale-bounce">
                      <div className="flex items-center gap-2 text-gaming-danger">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Installation failed</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Please check your internet connection and try again.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    {isVersionInstalled ? (
                      <>
                        <Button
                          variant="gaming-outline"
                          size="sm"
                          onClick={() => handleUninstall(version)}
                          disabled={isVersionInstalling}
                        >
                          Uninstall
                        </Button>
                        <Button
                          variant="gaming-success"
                          size="sm"
                          onClick={() => handleInstall(version)}
                          disabled={isVersionInstalling}
                          className="gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Reinstall
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="gaming-primary"
                        size="sm"
                        onClick={() => handleInstall(version)}
                        disabled={isVersionInstalling || status === 'downloading' || status === 'installing'}
                        className="gap-2"
                      >
                        {isVersionInstalling ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                            Installing...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Install
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex justify-end pt-4 border-t border-border">
            <Button variant="gaming-outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};