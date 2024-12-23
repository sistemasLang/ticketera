import { Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { JwtService } from "@nestjs/jwt";
import { ViewUserEntity } from './entity/view-user.entity'; 
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>, 

    @InjectRepository(ViewUserEntity)
    private readonly viewUsersRepository: Repository<ViewUserEntity>, 

    private readonly jwtService: JwtService // Servicio de JWT

  ) {}

  async getUsers(): Promise<ViewUserEntity[]> {
    return this.viewUsersRepository.find(); // Consulta la vista
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.usersRepository.create(createUserDto); 
    return this.usersRepository.save(user); 
  }

  async loginUser(username: string, password: string): Promise<{ token: string; user: { firstName: string; lastName: string } }> {
    // Busca al usuario
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('El usuario no fue encontrado');
    }

    // Verifica la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Genera el token
    const payload = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

    // Retorna el token y los datos básicos del usuario
    return {
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
