import { Body, Controller, Get, Post, UseGuards, Req } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';


@Controller('user')
export class UserController {


    constructor( private userService : UserService ){}

    @UseGuards(JwtAuthGuard)
    @Get('/getAll')
    async getUsers(){
        const users = await this.userService.getUsers();
        return {
          msg: `Se encontraron ${users.length} usuarios.`,
          data: users,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createUser(@Body() createUserDto: CreateUserDto) {
      try {
        const user = await this.userService.createUser(createUserDto);
        return {
          msg: 'Usuario creado exitosamente',
          data: user,
        };
      } catch (error) {
        console.error('Error en el controlador createUser:', error); // Depuración
        throw error;
      }
    }

    @Post('/login')
    async loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.userService.loginUser(loginUserDto.username, loginUserDto.password);
      }

    @UseGuards(JwtAuthGuard)
    @Post('/logout')
    logout() {
      return {
        msg: 'Sesión cerrada exitosamente',
        data: [],
      };
    }

    @UseGuards(JwtAuthGuard)
    @Post('/me')
    getProfile(@Req() req: Request) {
        console.log(req.user)
        return {
            msg: 'Información del usuario autenticado',
            data: {               
                username: req.user['username'],               
                firstName: req.user['firstName'],
                lastName: req.user['lastName'], 
              },
        };
    }

}