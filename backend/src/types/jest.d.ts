// Jest モック関数の型拡張
interface MockFunctionThis {
  mockReturnValue(value: any): any;
  mockResolvedValue(value: any): any;
  mockImplementation(fn: (...args: any[]) => any): any;
  mockResolvedValueOnce(value: any): any;
  mockReturnValueOnce(value: any): any;
}

// Node.js path モジュールの拡張
declare namespace NodeJS {
  interface Path {
    join: jest.Mock & ((...paths: string[]) => string);
    extname: jest.Mock & ((path: string) => string);
    basename: jest.Mock & ((path: string, suffix?: string) => string);
  }

  interface FS {
    existsSync: jest.Mock & ((path: string) => boolean);
    readdirSync: jest.Mock & ((path: string) => string[]);
    statSync: jest.Mock & ((path: string) => any);
    createWriteStream: jest.Mock & ((path: string) => any);
    unlink: jest.Mock & ((path: string) => Promise<void>);
    writeFile: jest.Mock & ((path: string, data: any) => Promise<void>);
    access: jest.Mock & ((path: string) => Promise<void>);
    mkdir: jest.Mock & ((path: string, options?: any) => Promise<void>);
  }
}

// Repository モックの型定義
interface MockRepository<T> {
  find: jest.Mock<Promise<T[]>, any[]>;
  findOne: jest.Mock<Promise<T | null>, any[]>;
  save: jest.Mock<Promise<T>, [any]>;
  create: jest.Mock<T, [any]>;
  merge: jest.Mock<T, [T, any]>;
  remove: jest.Mock<Promise<T>, [T]>;
  delete: jest.Mock<Promise<any>, [string]>;
  createQueryBuilder: jest.Mock<any, any[]>;
  count: jest.Mock<Promise<number>, any[]>;
}

// 拡張されたJestの型定義
declare namespace jest {
  interface Mock<T = any, Y extends any[] = any[]> {
    mockReturnValue(value: T): this;
    mockResolvedValue(value: T): this;
    mockImplementation(fn: (...args: Y) => T): this;
    mockResolvedValueOnce(value: T): this;
    mockReturnValueOnce(value: T): this;
    mockRejectedValue(value: any): this;
    mockRejectedValueOnce(value: any): this;
  }
}
