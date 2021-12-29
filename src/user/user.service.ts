import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/services/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private dbService:DatabaseService
  ){}
  async create(createUserDto: CreateUserDto):Promise<User> {
    const result = await this.dbService.execute(`INSERT INTO user SET ?`, createUserDto)
    return result[0][0]
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number):Promise<User> {
    try{
      const result  = await this.dbService.execute(`SELECT * FROM user WHERE id = ?`, [id])
      if(result[0].length<1) throw new Error(`user with ${id} not found`);
      return result[0][0]
    }
    catch(err){
      throw err
    }
  }

  async findMany(ids:Array<number>):Promise<Array<User>>{
    try{
      const result  = this.dbService.execute(`SELECT * FROM user WHERE id IN (?)`, [ids]);
      if(result[0].length<1) throw new Error(`users with ${ids.join(', ')} not found`)
      return result[0][0]
    }
    catch(err){
      throw err
    }

  }

 
}
