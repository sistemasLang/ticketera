import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateClientAuthDto {
  @IsString({ message: 'El campo auth debe ser un texto válido.' })
  @IsNotEmpty({ message: 'El campo auth es obligatorio.' })
  auth: string;

  @IsString({ message: 'El campo secret debe ser un texto válido.' })
  @IsNotEmpty({ message: 'El campo secret es obligatorio.' })
  secret: string;
}
