"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MockAppService {
    getHello() {
        return 'Hello World!';
    }
}
class MockAppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
}
describe('AppController', () => {
    let appController;
    let appService;
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
//# sourceMappingURL=app.controller.spec.js.map