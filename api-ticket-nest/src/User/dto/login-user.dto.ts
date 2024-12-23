import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  password: string;
}
