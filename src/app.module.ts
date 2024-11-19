import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AcceptLanguageResolver,
  I18nModule,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TranslateValidationErrorsInterceptor } from './interceptors/translateValidations.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmOptions } from './database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { AllExceptionsFilter } from './filters/catchEveryThing.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: createTypeOrmOptions as any,
      inject: [ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TranslateValidationErrorsInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
