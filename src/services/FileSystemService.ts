import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export class FileSystemService {
  async exists(path: string): Promise<boolean> {
    try {
      await Filesystem.stat({ path });
      return true;
    } catch {
      return false;
    }
  }

  async listFiles(path: string): Promise<string[]> {
    try {
      const result = await Filesystem.readdir({ path });
      return result.files.map(file => file.name);
    } catch (error) {
      throw new Error(`Failed to list files in ${path}: ${error}`);
    }
  }

  async listDirectories(path: string): Promise<string[]> {
    try {
      const result = await Filesystem.readdir({ path });
      return result.files
        .filter(file => file.type === 'directory')
        .map(file => file.name);
    } catch (error) {
      throw new Error(`Failed to list directories in ${path}: ${error}`);
    }
  }

  async readFile(path: string): Promise<string> {
    try {
      const result = await Filesystem.readFile({
        path,
        encoding: Encoding.UTF8
      });
      return result.data as string;
    } catch (error) {
      throw new Error(`Failed to read file ${path}: ${error}`);
    }
  }

  async writeFile(path: string, data: string | ArrayBuffer): Promise<void> {
    try {
      let writeData: string;
      let encoding: Encoding = Encoding.UTF8;

      if (typeof data === 'string') {
        writeData = data;
      } else {
        // Convert ArrayBuffer to base64 for binary files
        const bytes = new Uint8Array(data);
        writeData = btoa(String.fromCharCode(...bytes));
        encoding = undefined as any; // Binary data
      }

      await Filesystem.writeFile({
        path,
        data: writeData,
        encoding
      });
    } catch (error) {
      throw new Error(`Failed to write file ${path}: ${error}`);
    }
  }

  async createDirectory(path: string, options?: { recursive?: boolean }): Promise<void> {
    try {
      await Filesystem.mkdir({
        path,
        recursive: options?.recursive || false
      });
    } catch (error) {
      throw new Error(`Failed to create directory ${path}: ${error}`);
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      await Filesystem.deleteFile({ path });
    } catch (error) {
      throw new Error(`Failed to delete file ${path}: ${error}`);
    }
  }

  async deleteDirectory(path: string): Promise<void> {
    try {
      await Filesystem.rmdir({ path });
    } catch (error) {
      throw new Error(`Failed to delete directory ${path}: ${error}`);
    }
  }

  async joinPath(...segments: string[]): Promise<string> {
    // Simple path joining - in production, use proper path library
    return segments.join('/').replace(/\/+/g, '/');
  }

  async getAppDataPath(): Promise<string> {
    const isWindows = navigator.platform.toLowerCase().includes('win');
    
    if (isWindows) {
      return process.env.APPDATA || 'C:\\Users\\Default\\AppData\\Roaming';
    } else {
      return process.env.HOME + '/.local/share' || '/tmp';
    }
  }

  async selectDirectory(): Promise<string | null> {
    // This would integrate with native file picker
    // For now, return a mock implementation
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.webkitdirectory = true;
      
      input.addEventListener('change', (event) => {
        const files = (event.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          const path = files[0].webkitRelativePath.split('/')[0];
          resolve(path);
        } else {
          resolve(null);
        }
      });
      
      input.click();
    });
  }

  async getFileSize(path: string): Promise<number> {
    try {
      const stat = await Filesystem.stat({ path });
      return stat.size;
    } catch (error) {
      throw new Error(`Failed to get file size for ${path}: ${error}`);
    }
  }

  async copyFile(source: string, destination: string): Promise<void> {
    try {
      await Filesystem.copy({
        from: source,
        to: destination
      });
    } catch (error) {
      throw new Error(`Failed to copy file from ${source} to ${destination}: ${error}`);
    }
  }
}