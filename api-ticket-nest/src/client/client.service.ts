import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ViewClientEntity } from './entity/view-client.entity';
import { ClientEntity } from './entity/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateClientCredentialDto } from './dto/update-client-credential.dto';
import { generateAuthClient, generateSecret } from '../util/crypto.util';


@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ViewClientEntity)
    private readonly viewClientRepository: Repository<ViewClientEntity>,

    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async getClients(): Promise<ViewClientEntity[]> {
    return this.viewClientRepository.find(); 
  }

  async getClientById(id: number): Promise<ViewClientEntity> {
    const client = await this.viewClientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado.`);
    }
    return client;
  }

  async createClient(createClientDto: CreateClientDto): Promise<any> {
    const { client, web } = createClientDto;

    const auth = generateAuthClient();
    const secret = generateSecret();

    // Crear y guardar el cliente en la base de datos
    const newClient = this.clientRepository.create({
      authClient: auth,
      secret: secret,
      clientName: client,
      website: web,
    });

    await this.clientRepository.save(newClient);

    // Devuelve los datos generados y los enviados
    return {
      auth,
      secret,
      client,
      web,
    };
  }

  async updateClient(updateClientDto: UpdateClientDto): Promise<void> {
    const { id, client, web } = updateClientDto;

    // Busca el cliente existente
    const existingClient = await this.clientRepository.findOne({ where: { id } });

    if (!existingClient) {
      throw new NotFoundException(`No es posible actualizar el cliente ${id} ya que no existe.`);
    }

    // Actualiza los campos
    existingClient.clientName = client;
    existingClient.website = web;

    await this.clientRepository.save(existingClient); 
  }


  async updateClientCredential(updateClientCredentialDto: UpdateClientCredentialDto): Promise<any> {
    const { id } = updateClientCredentialDto;

    // Busca el cliente
    const existingClient = await this.clientRepository.findOne({ where: { id } });

    if (!existingClient) {
      throw new NotFoundException(`No se puede actualizar las credenciales del  ${id} ya que no existe.`);
    }

    // Genera nuevas credenciales
    const auth = generateAuthClient();
    const secret = generateSecret();

    // Actualiza las credenciales
    existingClient.authClient = auth;
    existingClient.secret = secret;

    const updatedClient = await this.clientRepository.save(existingClient);

    return {
      auth,
      secret,
      client: updatedClient.clientName,
      web: updatedClient.website,
    };
  }


   async validateClientAuth(auth: string, secret: string): Promise<ClientEntity | null> {
    const client = await this.clientRepository.findOne({ where: { authClient: auth } });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado.');
    }

    const isValidSecret = await this.dataSource.query(
      `SELECT crypt($1, $2) = $2 AS validado`,
      [secret, client.secret],
    );

    if (!isValidSecret[0].validado) {
      throw new NotFoundException('Secreto invalido');
    }

    return client;
  }


  async getPaginatedSupports( page: number = 1, limit: number = 20, filters: { [key: string]: any } = {}, ): Promise<
    {
      data: ViewClientEntity[];
      currentPage: number;
      totalPages: number;
      totalRegistry: number;
    }> {
      const query = this.viewClientRepository.createQueryBuilder('view_client');
  
     
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined) {
          query.andWhere(`view_client.${key} = :${key}`, { [key]: filters[key] });
        }
      });
  
      
      const totalRegistry = await query.getCount();
  
    
      const offset = (page - 1) * limit;
      query.skip(offset).take(limit);
  
    
      const data = await query.getMany();
  
     
      const totalPages = Math.ceil(totalRegistry / limit);
  
      return {
        data,
        currentPage: page,
        totalPages,
        totalRegistry,
      };
    }

}
