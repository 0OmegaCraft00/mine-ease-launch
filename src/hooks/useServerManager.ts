import { useState, useEffect, useCallback } from 'react';
import { ServerManager } from '@/services/ServerManager';
import { RealServerManager } from '@/services/RealServerManager';
import { FileSystemService } from '@/services/FileSystemService';
import { JavaService } from '@/services/JavaService';
import { ProcessService } from '@/services/ProcessService';
import { ServerConfig, ServerStatus, JavaVersion } from '@/types/server';

export const useServerManager = () => {
  const [serverManager] = useState(() => {
    const fileSystem = new FileSystemService();
    const java = new JavaService(fileSystem, new ProcessService());
    const process = new ProcessService();
    return new RealServerManager(fileSystem, java, process);
  });
  
  const [status, setStatus] = useState<ServerStatus>('offline');
  const [config, setConfig] = useState<ServerConfig | null>(null);
  const [javaVersions, setJavaVersions] = useState<JavaVersion[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [installProgress, setInstallProgress] = useState<number>(0);
  const [installStatus, setInstallStatus] = useState<string>('');

  useEffect(() => {
    // Initialize Java detection
    serverManager.java.initializeJavaDetection().then(() => {
      serverManager.java.getInstalledVersions().then(setJavaVersions);
    });

    // Listen for server events
    const handleOutput = (event: CustomEvent) => {
      setLogs(prev => [...prev, event.detail]);
    };

    const handleExit = () => {
      setStatus('offline');
    };

    window.addEventListener('server:output', handleOutput as EventListener);
    window.addEventListener('server:exit', handleExit);

    return () => {
      window.removeEventListener('server:output', handleOutput as EventListener);
      window.removeEventListener('server:exit', handleExit);
    };
  }, [serverManager]);

  const configureServer = useCallback(async (newConfig: ServerConfig) => {
    try {
      await serverManager.configureServer(newConfig);
      setConfig(newConfig);
    } catch (error) {
      throw error;
    }
  }, [serverManager]);

  const startServer = useCallback(async () => {
    try {
      await serverManager.startServer();
      setStatus('running');
    } catch (error) {
      throw error;
    }
  }, [serverManager]);

  const stopServer = useCallback(async () => {
    try {
      await serverManager.stopServer();
      setStatus('stopping');
    } catch (error) {
      throw error;
    }
  }, [serverManager]);

  const selectDirectory = useCallback(async () => {
    try {
      return await serverManager.fileSystem.selectDirectory();
    } catch (error) {
      throw error;
    }
  }, [serverManager]);

  const getServerJars = useCallback(async (path: string) => {
    try {
      return await serverManager.detectServerJars(path);
    } catch (error) {
      throw error;
    }
  }, [serverManager]);

  const installServer = useCallback(async (config: ServerConfig) => {
    try {
      await serverManager.installServer(config, (progress, status) => {
        setInstallProgress(progress);
        setInstallStatus(status);
      });
    } catch (error) {
      throw error;
    }
  }, [serverManager]);

  const installModpack = useCallback(async (modpackFile: File, installPath: string) => {
    try {
      const config = await serverManager.installModpack(modpackFile, installPath, (progress, status) => {
        setInstallProgress(progress);
        setInstallStatus(status);
      });
      setConfig(config);
      return config;
    } catch (error) {
      throw error;
    }
  }, [serverManager]);

  const startServerWithInstallation = useCallback(async () => {
    try {
      await serverManager.startServerWithInstallation();
      setStatus('running');
    } catch (error) {
      throw error;
    }
  }, [serverManager]);

  return {
    status,
    config,
    javaVersions,
    logs,
    installProgress,
    installStatus,
    configureServer,
    startServer,
    stopServer,
    selectDirectory,
    getServerJars,
    installServer,
    installModpack,
    startServerWithInstallation
  };
};