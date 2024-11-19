import {
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class TranslateValidationErrorsInterceptor implements NestInterceptor {
  constructor(private readonly i18nService: I18nService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(async (error) => {
        const language = this.getLanguageFromHeader(context);
        if (Array.isArray(error.errors)) {
          const translatedErrors = await Promise.all(
            error.errors.map(async (e) => {
              const constraints = e.constraints
                ? Object.values(e.constraints)[0]
                : 'Something went wrong';

              const translatedMessage = await this.i18nService.translate(
                constraints as string,
                {
                  lang: language,
                },
              );

              return { ...e, message: translatedMessage };
            }),
          );

          error.errors = translatedErrors;
        } else if (error?.message) {
          error.message = this.i18nService.translate(error.message, {
            lang: language,
          });
        }

        throw error;
      }),
    );
  }

  private getLanguageFromHeader(context: ExecutionContext): string {
    const req = context.switchToHttp().getRequest();
    const acceptLanguageHeader = req.headers['accept-language'];
    if (acceptLanguageHeader) {
      return acceptLanguageHeader.split(',')[0];
    }
    return 'en'; // Default to English if absent
  }
}
