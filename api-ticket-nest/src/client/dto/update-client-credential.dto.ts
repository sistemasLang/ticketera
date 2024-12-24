import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateClientCredentialDto {
  @IsNumber({}, { message: 'El ID debe ser un número válido.' })
  @IsNotEmpty({ message: 'El ID es obligatorio.' })
  id: number;
}
