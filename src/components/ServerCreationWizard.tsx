import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LoaderSelector, ServerLoader } from '@/components/LoaderSelector';
import { VersionSelector } from '@/components/VersionSelector';
import { ResourceSlider } from '@/components/ResourceSlider';
import { useLanguage } from '@/contexts/LanguageContext';
import { useServerManager } from '@/hooks/useServerManager';
import { ArrowLeft, ArrowRight, Download, Globe, Server, Wifi } from 'lucide-react';
import minesosLogo from '@/assets/minesos-logo.png';
import { ServerConfig, JavaVersion } from '@/types/server';

interface ServerCreationWizardProps {
  onBack: () => void;
  onComplete: (config: ServerConfig) => void;
}

export const ServerCreationWizard = ({ onBack, onComplete }: ServerCreationWizardProps) => {
  const { t, language, setLanguage } = useLanguage();
  const { javaVersions } = useServerManager();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  
  // Form state
  const [serverName, setServerName] = useState('');
  const [serverIP, setServerIP] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('1.21.4');
  const [selectedLoader, setSelectedLoader] = useState<ServerLoader>('vanilla');
  const [selectedJava, setSelectedJava] = useState('21');
  const [ramAllocation, setRamAllocation] = useState(4);
  const [cpuCores, setCpuCores] = useState(4);

  const generateRandomIP = () => {
    const adjectives = ['wheat', 'stone', 'oak', 'birch', 'diamond', 'iron', 'gold', 'emerald', 'ruby', 'crystal'];
    const nouns = ['hills', 'valley', 'peaks', 'forest', 'plains', 'mountain', 'river', 'lake', 'meadow', 'grove'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj}-${noun}.minecraft.com`;
  };

  const steps = [
    { title: 'Server Details', icon: Server },
    { title: 'Configuration', icon: Globe },
    { title: 'Network Setup', icon: Wifi },
    { title: 'Installation', icon: Download }
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hu' : 'en');
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleInstallation();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleInstallation = async () => {
    setIsInstalling(true);
    
    // Simulate installation process
    const installSteps = [
      'Downloading server files...',
      'Installing Java runtime...',
      'Configuring server properties...',
      'Setting up network...',
      'Finalizing installation...'
    ];
    
    for (let i = 0; i < installSteps.length; i++) {
      setInstallProgress((i + 1) * 20);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Generate random IP if not provided
    const finalIP = serverIP || generateRandomIP();
    
    const serverConfig: ServerConfig = {
      serverPath: `/minesos/servers/${serverName.toLowerCase().replace(/\s+/g, '-')}`,
      serverJar: `${selectedLoader}-${selectedVersion}.jar`,
      loader: selectedLoader as any,
      version: selectedVersion,
      javaVersion: selectedJava as JavaVersion,
      ramAllocation,
      cpuCores,
      serverPort: 25565,
      maxPlayers: 20,
      difficulty: 'normal',
      gamemode: 'survival',
      onlineMode: true,
      whitelist: false,
      motd: `${serverName} - Powered by MinesOS`
    };
    
    // Save server to localStorage
    const servers = JSON.parse(localStorage.getItem('minesos-servers') || '[]');
    const newServer = {
      id: Date.now().toString(),
      name: serverName,
      ip: finalIP,
      status: 'offline' as const,
      config: serverConfig,
      lastPlayed: new Date()
    };
    servers.push(newServer);
    localStorage.setItem('minesos-servers', JSON.stringify(servers));
    
    setInstallProgress(100);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onComplete(serverConfig);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return serverName.trim().length > 0;
      case 1:
        return selectedVersion && selectedLoader && selectedJava;
      case 2:
        return true; // IP is optional
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={minesosLogo} alt="MinesOS Logo" className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create New Server</h1>
              <p className="text-muted-foreground">Step {currentStep + 1} of {steps.length}</p>
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

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={(currentStep + 1) / steps.length * 100} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className={`flex items-center gap-1 ${index <= currentStep ? 'text-primary' : ''}`}>
                  <Icon className="w-4 h-4" />
                  {step.title}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-gaming-surface border-border shadow-elevated">
          <CardContent className="p-8">
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Server Details</h2>
                  <p className="text-muted-foreground">Give your server a name and identity</p>
                </div>
                
                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Server Name *
                    </label>
                    <Input 
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                      placeholder="My Awesome Server"
                      className="bg-gaming-surface-elevated border-border text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Server Configuration</h2>
                  <p className="text-muted-foreground">Choose your server software and resources</p>
                </div>
                
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <LoaderSelector
                        value={selectedLoader}
                        onChange={setSelectedLoader}
                      />
                    </div>
                    <div>
                      <VersionSelector 
                        value={selectedVersion}
                        onChange={setSelectedVersion}
                        javaVersion={selectedJava as JavaVersion}
                        onJavaChange={setSelectedJava}
                        availableJavaVersions={javaVersions}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResourceSlider
                      label="RAM Allocation"
                      value={ramAllocation}
                      onChange={setRamAllocation}
                      min={1}
                      max={32}
                      unit="GB"
                    />
                    <ResourceSlider
                      label="CPU Cores"
                      value={cpuCores}
                      onChange={setCpuCores}
                      min={1}
                      max={16}
                      unit="cores"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Network Setup</h2>
                  <p className="text-muted-foreground">Configure your server's network settings</p>
                </div>
                
                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Server IP/Domain (Optional)
                    </label>
                    <Input 
                      value={serverIP}
                      onChange={(e) => setServerIP(e.target.value)}
                      placeholder="play.myserver.com"
                      className="bg-gaming-surface-elevated border-border text-foreground"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Leave empty to generate a random domain like: <strong>{generateRandomIP()}</strong>
                    </p>
                  </div>
                  
                  <div className="bg-gaming-surface-elevated rounded-lg p-4 space-y-2">
                    <h3 className="font-medium text-foreground">Network Features</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>✓ Automatic UPnP port forwarding</li>
                      <li>✓ Dynamic DNS support</li>
                      <li>✓ SSL certificate generation</li>
                      <li>✓ DDoS protection</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {isInstalling ? 'Installing Server...' : 'Ready to Install'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isInstalling 
                      ? 'Please wait while we set up your server'
                      : 'Review your configuration and start the installation'
                    }
                  </p>
                </div>
                
                {!isInstalling && (
                  <div className="max-w-2xl mx-auto bg-gaming-surface-elevated rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-foreground">Server Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <p className="text-foreground font-medium">{serverName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">IP</p>
                        <p className="text-foreground font-medium">{serverIP || 'Auto-generated'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Version</p>
                        <p className="text-foreground font-medium">{selectedVersion}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Loader</p>
                        <p className="text-foreground font-medium capitalize">{selectedLoader}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">RAM</p>
                        <p className="text-foreground font-medium">{ramAllocation}GB</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Java</p>
                        <p className="text-foreground font-medium">{selectedJava}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {isInstalling && (
                  <div className="max-w-md mx-auto space-y-4">
                    <Progress value={installProgress} className="h-4" />
                    <p className="text-center text-sm text-muted-foreground">
                      {installProgress}% Complete
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="gaming-outline" 
            onClick={handleBack}
            disabled={isInstalling}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Button 
            variant="gaming-primary" 
            onClick={handleNext}
            disabled={!canProceed() || isInstalling}
            className="gap-2"
          >
            {currentStep === steps.length - 1 ? (
              isInstalling ? (
                'Installing...'
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Install Server
                </>
              )
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};