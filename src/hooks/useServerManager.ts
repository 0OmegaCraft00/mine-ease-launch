import { useState, useEffect, useCallback } from 'react';
import { ServerManager } from '@/services/ServerManager';
import { FileSystemService } from '@/services/FileSystemService';
import { JavaService } from '@/services/JavaService';
import { ProcessService } from '@/services/ProcessService';
import { ServerConfig, ServerStatus, JavaVersion } from '@/types/server';

export const useServerManager = () => {
  const [serverManager] = useState(() => {
    const fileSystem = new FileSystemService();
    const java = new JavaService(fileSystem, new ProcessService());
    const process = new ProcessService();
    return new ServerManager(fileSystem, java, process);
  });
  
  const [status, setStatus] = useState<ServerStatus>('offline');
  const [config, setConfig] = useState<ServerConfig | null>(null);
  const [javaVersions, setJavaVersions] = useState<JavaVersion[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

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

  return {
    status,
    config,
    javaVersions,
    logs,
    configureServer,
    startServer,
    stopServer,
    selectDirectory,
    getServerJars
  };
};