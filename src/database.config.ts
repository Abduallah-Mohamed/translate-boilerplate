import { ConfigService } from '@nestjs/config';

export const createTypeOrmOptions = (configService: ConfigService) => ({
  type: configService.get<string>('database.type'),
  host: configService.get<string>('database.host'),
  port: configService.get<number>('database.port'),
  username: configService.get<string>('database.user'),
  password: configService.get<string>('database.password'),
  database: configService.get<string>('database.name'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
});
