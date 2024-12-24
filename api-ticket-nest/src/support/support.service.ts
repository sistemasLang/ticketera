import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewSupportEntity } from './entity/view-support.entity';
import { SupportEntity } from './entity/support.entity.js';
import { PriorityEntity } from './entity/priority.entity';
import { StateEntity } from './entity/state.entity';





@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(ViewSupportEntity)
    private readonly viewSupportRepository: Repository<ViewSupportEntity>, 

    @InjectRepository(SupportEntity)
    private readonly supportRepository: Repository<SupportEntity>, 

    @InjectRepository(PriorityEntity)
    private readonly priorityRepository: Repository<PriorityEntity>, 

    @InjectRepository(StateEntity)
    private readonly stateRepository: Repository<StateEntity>, 
  ) {}

  async getAllSupports(): Promise<ViewSupportEntity[]> {
    return this.viewSupportRepository.find();
  }

  async getPaginatedSupports( page: number = 1, limit: number = 20, filters: { [key: string]: any } = {}, ): Promise<
  {
    data: ViewSupportEntity[];
    currentPage: number;
    totalPages: number;
    totalRegistry: number;
  }> {
    const query = this.viewSupportRepository.createQueryBuilder('support');

   
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined) {
        query.andWhere(`support.${key} = :${key}`, { [key]: filters[key] });
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


  async getAllPriority(): Promise<PriorityEntity[]> {
    return this.priorityRepository.find();
  }

  async getAllState(): Promise<StateEntity[]> {
    return this.stateRepository.find();
  }

  async getSupportById(id: number): Promise<ViewSupportEntity> {
    const support = await this.viewSupportRepository.findOne({ where: { id } });

    return support;
  }

  async createSupport(clientId: number, title: string, description: string): Promise<SupportEntity> {
    const newSupport = this.supportRepository.create({
      clientId,
      title,
      description,
    });

    return this.supportRepository.save(newSupport);
  }


  async editTicket(id: number, updates: Partial<SupportEntity>): Promise<SupportEntity> {
   
    const ticket = await this.supportRepository.findOne({ where: { id } });

    if (!ticket) {
      throw new NotFoundException(`El ticket con ID ${id} no fue encontrado.`);
    }

    Object.assign(ticket, updates);

 
    return this.supportRepository.save(ticket);
  }

  async getTicketsByCliente(clientId: number, id?: number): Promise<SupportEntity[]> {

    const whereClause = id ? { clientId, id }  : { clientId };   
    
    return this.supportRepository.find({ where: whereClause });
  }


  

}


