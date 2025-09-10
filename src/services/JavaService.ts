import { JavaVersion } from '@/types/server';
import { FileSystemService } from './FileSystemService';
import { ProcessService } from './ProcessService';

export class JavaService {
  private javaInstallations: Map<JavaVersion, string> = new Map();

  constructor(
    private fileSystem: FileSystemService,
    private process: ProcessService
  ) {}

  async initializeJavaDetection(): Promise<void> {
    await this.detectSystemJava();
    await this.detectPortableJava();
  }

  async ensureJavaVersion(version: JavaVersion): Promise<string> {
    const existing = this.javaInstallations.get(version);
    if (existing) return existing;

    // Try to install Java if not found
    await this.installJavaVersion(version);
    
    const installed = this.javaInstallations.get(version);
    if (!installed) {
      throw new Error(`Failed to install Java ${version}`);
    }
    
    return installed;
  }

  async isVersionAvailable(version: JavaVersion): Promise<boolean> {
    return this.javaInstallations.has(version);
  }

  async getJavaPath(version: JavaVersion): Promise<string> {
    const path = this.javaInstallations.get(version);
    if (!path) {
      throw new Error(`Java ${version} is not installed`);
    }
    return path;
  }

  async getInstalledVersions(): Promise<JavaVersion[]> {
    return Array.from(this.javaInstallations.keys());
  }

  private async detectSystemJava(): Promise<void> {
    const commonPaths = this.getCommonJavaPaths();
    
    for (const path of commonPaths) {
      try {
        const exists = await this.fileSystem.exists(path);
        if (exists) {
          const version = await this.getJavaVersionFromPath(path);
          if (version) {
            this.javaInstallations.set(version, path);
          }
        }
      } catch (error) {
        console.warn(`Failed to check Java at ${path}:`, error);
      }
    }
  }

  private async detectPortableJava(): Promise<void> {
    const appDataPath = await this.fileSystem.getAppDataPath();
    const javaDir = await this.fileSystem.joinPath(appDataPath, 'MinesOS', 'java');
    
    try {
      const exists = await this.fileSystem.exists(javaDir);
      if (!exists) return;

      const versions = await this.fileSystem.listDirectories(javaDir);
      
      for (const versionDir of versions) {
        const javaPath = await this.getJavaExecutablePath(
          await this.fileSystem.joinPath(javaDir, versionDir)
        );
        
        const version = this.parseVersionFromName(versionDir);
        if (version && await this.fileSystem.exists(javaPath)) {
          this.javaInstallations.set(version, javaPath);
        }
      }
    } catch (error) {
      console.warn('Failed to detect portable Java installations:', error);
    }
  }

  private async installJavaVersion(version: JavaVersion): Promise<void> {
    const appDataPath = await this.fileSystem.getAppDataPath();
    const javaDir = await this.fileSystem.joinPath(appDataPath, 'MinesOS', 'java');
    const versionDir = await this.fileSystem.joinPath(javaDir, `java${version}`);
    
    // Create directory if it doesn't exist
    await this.fileSystem.createDirectory(versionDir, { recursive: true });
    
    // Download and install Java
    const downloadUrl = this.getJavaDownloadUrl(version);
    const installerPath = await this.fileSystem.joinPath(versionDir, 'installer.zip');
    
    try {
      // Download Java
      await this.downloadJava(downloadUrl, installerPath);
      
      // Extract Java
      await this.extractJava(installerPath, versionDir);
      
      // Find Java executable
      const javaPath = await this.findJavaExecutable(versionDir);
      
      if (javaPath) {
        this.javaInstallations.set(version, javaPath);
      }
      
      // Clean up installer
      await this.fileSystem.deleteFile(installerPath);
      
    } catch (error) {
      console.error(`Failed to install Java ${version}:`, error);
      throw error;
    }
  }

  private getCommonJavaPaths(): string[] {
    const isWindows = navigator.platform.toLowerCase().includes('win');
    
    if (isWindows) {
      return [
        'C:\\Program Files\\Java\\jdk-21\\bin\\java.exe',
        'C:\\Program Files\\Java\\jdk-17\\bin\\java.exe',
        'C:\\Program Files\\Java\\jdk-16\\bin\\java.exe',
        'C:\\Program Files\\Java\\jdk1.8.0_321\\bin\\java.exe',
        'C:\\Program Files (x86)\\Java\\jre1.8.0_321\\bin\\java.exe',
        'C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.1.12-hotspot\\bin\\java.exe',
        'C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.9.9-hotspot\\bin\\java.exe'
      ];
    } else {
      return [
        '/usr/lib/jvm/java-21-openjdk/bin/java',
        '/usr/lib/jvm/java-17-openjdk/bin/java',
        '/usr/lib/jvm/java-16-openjdk/bin/java',
        '/usr/lib/jvm/java-8-openjdk/bin/java',
        '/System/Library/Java/JavaVirtualMachines/1.8.0.jdk/Contents/Home/bin/java',
        '/Library/Java/JavaVirtualMachines/adoptopenjdk-21.jdk/Contents/Home/bin/java'
      ];
    }
  }

  private async getJavaVersionFromPath(javaPath: string): Promise<JavaVersion | null> {
    try {
      const output = await this.process.execute(`"${javaPath}" -version`);
      return this.parseJavaVersionOutput(output);
    } catch {
      return null;
    }
  }

  private parseJavaVersionOutput(output: string): JavaVersion | null {
    const versionMatch = output.match(/version "(\d+)\.?(\d+)?/);
    if (!versionMatch) return null;
    
    const major = parseInt(versionMatch[1]);
    const minor = versionMatch[2] ? parseInt(versionMatch[2]) : 0;
    
    if (major === 1 && minor === 8) return '8';
    if (major === 16) return '16';
    if (major === 17) return '17';
    if (major === 21) return '21';
    
    return null;
  }

  private parseVersionFromName(dirName: string): JavaVersion | null {
    if (dirName.includes('java8') || dirName.includes('1.8')) return '8';
    if (dirName.includes('java16')) return '16';
    if (dirName.includes('java17')) return '17';
    if (dirName.includes('java21')) return '21';
    return null;
  }

  private getJavaDownloadUrl(version: JavaVersion): string {
    const baseUrl = 'https://github.com/adoptium/temurin21-binaries/releases/download';
    const isWindows = navigator.platform.toLowerCase().includes('win');
    const arch = 'x64';
    
    const platform = isWindows ? 'windows' : 'linux';
    const extension = isWindows ? 'zip' : 'tar.gz';
    
    const urls: Record<JavaVersion, string> = {
      '8': `${baseUrl}/jdk8u392-b08/OpenJDK8U-jdk_${arch}_${platform}_hotspot_8u392b08.${extension}`,
      '16': `${baseUrl}/jdk-16.0.2%2B7/OpenJDK16U-jdk_${arch}_${platform}_hotspot_16.0.2_7.${extension}`,
      '17': `${baseUrl}/jdk-17.0.9%2B9/OpenJDK17U-jdk_${arch}_${platform}_hotspot_17.0.9_9.${extension}`,
      '21': `${baseUrl}/jdk-21.0.1%2B12/OpenJDK21U-jdk_${arch}_${platform}_hotspot_21.0.1_12.${extension}`
    };
    
    return urls[version];
  }

  private async downloadJava(url: string, outputPath: string): Promise<void> {
    // Implementation would use Capacitor HTTP plugin or fetch API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download Java: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    await this.fileSystem.writeFile(outputPath, arrayBuffer);
  }

  private async extractJava(archivePath: string, outputDir: string): Promise<void> {
    // Implementation would use native extraction library
    // For now, this is a placeholder that would need platform-specific implementation
    console.log(`Extracting ${archivePath} to ${outputDir}`);
  }

  private async findJavaExecutable(installDir: string): Promise<string | null> {
    const possiblePaths = [
      'bin/java.exe',
      'bin/java',
      'jdk/bin/java.exe',
      'jdk/bin/java'
    ];
    
    for (const relativePath of possiblePaths) {
      const fullPath = await this.fileSystem.joinPath(installDir, relativePath);
      const exists = await this.fileSystem.exists(fullPath);
      if (exists) return fullPath;
    }
    
    return null;
  }

  private async getJavaExecutablePath(javaHome: string): Promise<string> {
    const isWindows = navigator.platform.toLowerCase().includes('win');
    const executable = isWindows ? 'java.exe' : 'java';
    return await this.fileSystem.joinPath(javaHome, 'bin', executable);
  }
}