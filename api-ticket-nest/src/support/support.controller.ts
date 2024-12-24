import { Body, Controller, Get, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SupportService } from './support.service';
import { GetSupportByIdDto } from './dto/get-support-by-id.dto';
import { CreateTicketDto, GetTicketByAuthDto } from './dto/support-requests.dto';
import { ClientService } from '../client/client.service'; 




@Controller('support')
export class SupportController {
  constructor(
    private readonly supportService: SupportService,
    private readonly clientService: ClientService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async getAllSupports() {
    const supports = await this.supportService.getAllSupports();
    return {
      msg: `Se encontraron ${supports.length} soportes.`,
      data: supports,
    };
  }


  @UseGuards(JwtAuthGuard)
  @Post('getById')
  async getSupportById(@Body() getSupportByIdDto: GetSupportByIdDto) {
    const support = await this.supportService.getSupportById(getSupportByIdDto.id);
    if (!support) {
        return {
            msg: `No se encontro el soporte con el id ${getSupportByIdDto.id}`,         
        };
    }
    return {
      msg: '',
      data: support,
    };
  }

  @Post('create')
  async createSupport(@Body() createTicketDto: CreateTicketDto) {
    const { auth, secret, title, description } = createTicketDto;

    
    const client = await this.clientService.validateClientAuth(auth, secret);

    if (!client) {
      return {
        msg: 'Autenticación inválida.',
        data: [],
      };
    }
  
   
    const newSupport = await this.supportService.createSupport(client.id, title, description);
  
    return {
      msg: 'Soporte creado exitosamente.',
      data: newSupport,
    };

  }


  
}
