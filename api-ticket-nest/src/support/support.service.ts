import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewSupportEntity } from './entity/view-support.entity';
import { SupportEntity } from './entity/support.entity.js';




@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(ViewSupportEntity)
    private readonly viewSupportRepository: Repository<ViewSupportEntity>, // Repositorio para la vista

    @InjectRepository(SupportEntity)
    private readonly supportRepository: Repository<SupportEntity>, // Repositorio para la tabla de soporte
  ) {}

  async getAllSupports(): Promise<ViewSupportEntity[]> {
    return this.viewSupportRepository.find();
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


}


