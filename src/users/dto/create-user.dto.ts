import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @IsString({ message: i18nValidationMessage('validations.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY') })
  readonly name: string;

  @IsString({
    message: i18nValidationMessage('validations.IS_STRING_PASSWORD'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validations.IS_EMPTY_PASSWORD'),
  })
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_+=])[A-Za-z\d!@#$%^&*()-_+=]{8,}$/,
    {
      message: i18nValidationMessage('validations.IS_STRONG_PASSWORD'),
    },
  )
  @MinLength(8, { message: i18nValidationMessage('validations.MIN_LENGTH') })
  @MaxLength(20, { message: i18nValidationMessage('validations.MAX_LENGTH') })
  readonly password: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validations.IS_EMPTY_EMAIL'),
  })
  @IsEmail({}, { message: i18nValidationMessage('validations.INVALID_EMAIL') })
  readonly email: string;
}
