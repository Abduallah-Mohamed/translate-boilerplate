import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // import config file so that i can use it in the main.ts file
  const config = app.get(ConfigService);
  const port = config.get('port');
  app.useGlobalPipes(new I18nValidationPipe());

  // example of the next global filter
  /*
    {
    "statusCode": 400,
    "message": "Validation failed",
    "errors": [
        {
            "property": "password",
            "messages": [
                "كلمة المرور لا يجب ان تكون فارغة",
                "كلمة المرور يجب ان تكون نص"
            ]
        },
        {
            "property": "email",
            "messages": [
                "البريد الالكتروني غير صحيح",
                "البريد الالكتروني لا يجب ان يكون فارغا"
            ]
        }
    ],
    "url": "/users",
    "method": "POST",
    "timestamp": "2024-02-29T20:12:06.808Z"
}
  */
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      errorFormatter: (errors) => {
        const formattedErrors = errors.map((error) => {
          const constraints = Object.values(error.constraints);
          return {
            property: error.property,
            messages: constraints,
          };
        });
        return formattedErrors;
      },
      responseBodyFormatter: (host, exc, formattedErrors) => {
        return {
          statusCode: exc.getStatus(),
          message: exc.getResponse() || 'Validation failed',
          errors: formattedErrors,
          url: host.switchToHttp().getRequest().url,
          method: host.switchToHttp().getRequest().method,
          timestamp: new Date().toISOString(),
        };
      },
    }),
  );
  await app.listen(port, async () => {
    console.log(`Server is running on ${await app.getUrl()}`);
  });
}
bootstrap();
