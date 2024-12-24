import { Body, Controller, Get, NotFoundException, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SupportService } from './support.service';
import { GetSupportByIdDto } from './dto/get-support-by-id.dto';
import { CreateTicketDto, GetTicketByAuthDto, GetTicketsIdAuthDto, EditTicketDto} from './dto/support-requests.dto';
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
  @Post('/getSupport')
  async getPaginatedSupports(@Body() body: { page?: number; limit?: number; filters?: { [key: string]: any } },) {
    const { page = 1, limit = 20, filters = {} } = body;

    const result = await this.supportService.getPaginatedSupports(page, limit, filters);

    return {
      success: true,
      msg: `Se encontraron ${result.totalRegistry} soportes.`,
      data: result,
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

  @UseGuards(JwtAuthGuard)
  @Get('getState')
  async getState() {
    const states = await this.supportService.getAllState();
    return {
      msg: `Se encontraron ${states.length} estados.`,
      data: states,
    };
  }


  @UseGuards(JwtAuthGuard)
  @Get('getPriority')
  async getPriority() {
    const priority = await this.supportService.getAllPriority();
    return {
      msg: `Se encontraron ${priority.length} estados.`,
      data: priority,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('editTicket')
  async editTicket(@Body() editTicketDto: EditTicketDto) {

    const { id, idstate, idprioridad, iduser } = editTicketDto;

    const updatedTicket = await this.supportService.editTicket(id, {
      stateId: idstate,
      priorityId: idprioridad,
      userId: iduser,
    });

    return {
      msg: `El ticket con ID ${id} fue actualizado exitosamente.`,
      data: updatedTicket,
    };
  }

  //Servicios para el cliente
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

  @Post('getTicketAuthCliente')
  async getTicketAuthCliente(@Body() getTicketAuthCliente: GetTicketByAuthDto) {
    const { auth, secret } = getTicketAuthCliente;


    const client = await this.clientService.validateClientAuth(auth, secret);

    if (!client) {
      return {
        msg: 'Autenticación inválida.',
        data: [],
      };
    }
    
    const tickets = await this.supportService.getTicketsByCliente(client.id)

    if (!tickets) {
      return {
        msg: 'No se han encontrado tickets',
        data: [],
      };
    }

    return {
      data: tickets
    }

  }


  @Post('getTicketIdSupportByAuth')
  async getTicketIdSupportByAuth(@Body() GetTicketsIdAuthDto: GetTicketsIdAuthDto) {
    const { id, auth, secret } = GetTicketsIdAuthDto;


    const client = await this.clientService.validateClientAuth(auth, secret);

    if (!client) {
      return {
        msg: 'Autenticación inválida.',
        data: [],
      };
    }
    
    const tickets = await this.supportService.getTicketsByCliente(client.id, id)

    if (!tickets) {
      return {
        msg: `No se han encontrado el ticket con id ${id}`,
        data: [],
      };
    }

    return {
      data: tickets
    }

  }







  
}
