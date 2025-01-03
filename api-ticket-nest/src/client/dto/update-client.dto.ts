import { IsNumber, IsString, IsNotEmpty, Length } from 'class-validator';

export class UpdateClientDto {
  @IsNumber({}, { message: 'El ID debe ser un número válido.' })
  @IsNotEmpty({ message: 'El ID es obligatorio.' })
  id: number;

  @IsString({ message: 'El nombre del cliente debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre del cliente es obligatorio.' })
  @Length(1, 150, { message: 'El nombre del cliente debe tener entre 1 y 150 caracteres.' })
  client: string;

  @IsString({ message: 'El sitio web debe ser un texto.' })
  @IsNotEmpty({ message: 'El sitio web es obligatorio.' })
  @Length(1, 150, { message: 'El sitio web debe tener entre 1 y 150 caracteres.' })
  web: string;
}
