import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express'; // note the casting to Express types
import { I18nContext, I18nService } from 'nestjs-i18n';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(private readonly i18n: I18nService) {
    super(); // becaue we are extending the base class
  }
  catch(exception: any, host: ArgumentsHost) {
    console.log('exception', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string = this.i18n.t('errors.INTERNAL_SERVER_ERROR', {
      lang: I18nContext.current().lang,
    });

    console.log(exception);

    if (exception?.errno === 1406) {
      // data too long for column
      httpStatus = HttpStatus.BAD_REQUEST;
      message = this.i18n.t('errors.DATA_TOO_LONG', {
        lang: I18nContext.current().lang,
      });
    }

    if (exception?.errno === 1062) {
      // duplicate entry
      httpStatus = HttpStatus.CONFLICT;
      message = this.i18n.t('errors.DUPLICATE_ENTRY', {
        lang: I18nContext.current().lang,
      });
    }

    if (exception?.errno === 1452) {
      // foreign key constraint
      httpStatus = HttpStatus.BAD_REQUEST;
      message = this.i18n.t('errors.FOREIGN_KEY_CONSTRAINT', {
        lang: I18nContext.current().lang,
      });
    }

    if (exception?.errno === 1366) {
      // incorrect string value
      httpStatus = HttpStatus.BAD_REQUEST;
      message = this.i18n.t('errors.INCORRECT_STRING_VALUE', {
        lang: I18nContext.current().lang,
      });
    }

    if (exception?.errno === 1048) {
      // incorrect string value
      httpStatus = HttpStatus.BAD_REQUEST;
      message = this.i18n.t('errors.REQUIRED_FIELD', {
        lang: I18nContext.current().lang,
      });
    }

    if (exception?.errno === 1064) {
      // incorrect string value
      httpStatus = HttpStatus.BAD_REQUEST;
      message = this.i18n.t('errors.INVALID_SYNTAX', {
        lang: I18nContext.current().lang,
      });
    }

    if (exception?.errno === 1364) {
      // incorrect string value
      httpStatus = HttpStatus.BAD_REQUEST;
      message = this.i18n.t('errors.NULL_VALUE', {
        lang: I18nContext.current().lang,
      });
    }

    // if there is any error with any different status code, it will render the error page with the status code based on the error
    // response.status(httpStatus);
    // response.render(`views/errors/${httpStatus}`);

    console.log('HELLO FROM ALL EXCEPTIONS FILTER');
    response.status(httpStatus).json({
      statusCode: httpStatus,
      message: message || exception?.message || null,
      errors: (exception as any).errors || null,
    });
  }
}
