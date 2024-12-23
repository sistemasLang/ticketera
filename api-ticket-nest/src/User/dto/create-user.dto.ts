import { IsString, IsEmail, Length, IsBoolean, IsOptional, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString({ message: 'El nombre de usuario debe ser un texto.' })
  @Length(3, 100, { message: 'El nombre de usuario debe tener entre 3 y 100 caracteres.' })
  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true }) 
  username: string;

  @IsString({ message: 'La contraseña debe ser un texto.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, { 
    message: 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y tener al menos 6 caracteres.' 
  })
  password: string;

  @IsString({ message: 'El nombre debe ser un texto.' })
  @Length(1, 150, { message: 'El nombre debe tener entre 1 y 150 caracteres.' })
  firstName: string;

  @IsString({ message: 'El apellido debe ser un texto.' })
  @Length(1, 150, { message: 'El apellido debe tener entre 1 y 150 caracteres.' })
  lastName: string;

  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido.' })
  email: string;

  @IsBoolean({ message: 'El campo isEnabled debe ser verdadero o falso.' })
  @IsOptional()
  isEnabled?: boolean; // Campo opcional
}
