"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
beforeAll(() => {
    const validationPipe = new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        validateCustomDecorators: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    });
    (0, class_validator_1.useContainer)({ get: () => null }, { fallbackOnErrors: true });
});
//# sourceMappingURL=setup.js.map