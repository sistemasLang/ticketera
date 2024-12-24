import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetTicketByAuthDto {
  @IsNumber({}, { message: 'El ID debe ser un número.' })
  @IsOptional()
  id?: number;

  @IsString({ message: 'El campo auth es obligatorio.' })
  @IsNotEmpty({ message: 'El campo auth no puede estar vacío.' })
  auth: string;

  @IsString({ message: 'El campo vsecret es obligatorio.' })
  @IsNotEmpty({ message: 'El campo vsecret no puede estar vacío.' })
  secret: string;
}

export class CreateTicketDto {
  @IsString({ message: 'El campo auth es obligatorio.' })
  @IsNotEmpty({ message: 'El campo auth no puede estar vacío.' })
  auth: string;

  @IsString({ message: 'El campo vsecret es obligatorio.' })
  @IsNotEmpty({ message: 'El campo vsecret no puede estar vacío.' })
  secret: string;

  @IsString({ message: 'El título es obligatorio.' })
  @IsNotEmpty({ message: 'El título no puede estar vacío.' })
  title: string;

  @IsString({ message: 'La descripción es obligatoria.' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía.' })
  description: string;
}


