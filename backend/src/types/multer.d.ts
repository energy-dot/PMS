declare module 'multer' {
  import { Request } from 'express';
  
  interface StorageEngine {
    _handleFile(req: Request, file: Express.Multer.File, callback: (error?: any, info?: any) => void): void;
    _removeFile(req: Request, file: Express.Multer.File, callback: (error: Error) => void): void;
  }
  
  interface DiskStorageOptions {
    destination?: string | ((req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => void);
    filename?: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => void;
  }
  
  export function diskStorage(options: DiskStorageOptions): StorageEngine;

  export default function multer(options?: any): any;
}
