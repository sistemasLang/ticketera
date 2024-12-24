import { IsNumber, IsNotEmpty } from 'class-validator';

export class GetClientByIdDto {
  @IsNumber({}, { message: 'El ID debe ser un número.' })
  @IsNotEmpty({ message: 'El ID es obligatorio.' })
  id: number;
}
