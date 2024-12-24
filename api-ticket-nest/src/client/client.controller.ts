import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ClientService } from './client.service';
import { GetClientByIdDto } from './dto/get-client-by-id.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateClientCredentialDto } from './dto/update-client-credential.dto';



@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async getClients() {
    const clients = await this.clientService.getClients();
    return {
      msg: `Se encontraron ${clients.length} clientes.`,
      data: clients,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/getClients')
  async getPaginatedSupports(@Body() body: { page?: number; limit?: number; filters?: { [key: string]: any } },) {
    const { page = 1, limit = 20, filters = {} } = body;

    const result = await this.clientService.getPaginatedSupports(page, limit, filters);

    return {
      success: true,
      msg: `Se encontraron ${result.totalRegistry} soportes.`,
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('getById')
  async getClientById(@Body() getClientByIdDto: GetClientByIdDto) {
    const client = await this.clientService.getClientById(getClientByIdDto.id);
    return {
      msg: `Cliente encontrado.`,
      data: client,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createClient(@Body() createClientDto: CreateClientDto) {
    const result = await this.clientService.createClient(createClientDto);
    return {
      msg: 'Operación exitosa, recuerde enviar los datos al cliente.',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('updateclient')
  async updateClient(@Body() updateClientDto: UpdateClientDto) {
    await this.clientService.updateClient(updateClientDto);
    return {
      msg: 'Cliente actualizado exitosamente.',
      data: [],
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('updateCredential')
  async updateClientCredential(@Body() updateClientCredentialDto: UpdateClientCredentialDto) {
    const result = await this.clientService.updateClientCredential(updateClientCredentialDto);
    return {
      msg: 'Operación exitosa, recuerde enviar los datos al cliente.',
      data: result,
    };
  }


}
