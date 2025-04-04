import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('database', () => ({
  type: 'sqlite',
  database: join(__dirname, '..', '..', 'database.sqlite'),
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  synchronize: true,
}));
