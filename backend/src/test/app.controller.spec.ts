import { Test } from '@nestjs/testing';

// モックサービスとコントローラーの作成
class MockAppService {
  getHello(): string {
    return 'Hello World!';
  }
}

class MockAppController {
  constructor(private readonly appService: MockAppService) {}

  getHello(): string {
    return this.appService.getHello();
  }
}

describe('AppController', () => {
  let appController: MockAppController;
  let appService: MockAppService;

  beforeEach(async () => {
    appService = new MockAppService();
    appController = new MockAppController(appService);
  });

  describe('getHello', () => {
    it('should return the string returned by appService.getHello', () => {
      const result = 'Hello World!';
      jest.spyOn(appService, 'getHello').mockImplementation(() => result);
      expect(appController.getHello()).toBe(result);
    });
  });
});
