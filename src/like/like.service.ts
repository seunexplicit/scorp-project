import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/services/database/database.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Like } from './entities/like.entity';

@Injectable()
export class LikeService {

  constructor(private dbService:DatabaseService){}

  create(createLikeDto: CreateLikeDto) {
    try{
      return this.dbService.execute(
        `INSERT INTO like (post_id, user_id) VALUES (${createLikeDto.post_id}, ${createLikeDto.user_id})`
        )
    }
    catch(err){
      throw err
    }
  }

  async findAll() {
    try{
      return this.dbService.execute('SELECT * FROM like')
    }
    catch(err){
      throw err;
    }
  }

  async findOne(id: number) {
    try{
      return this.dbService.execute(`SELECT * FROM like WHERE id = ?`, [id])
    }
    catch(err){
      throw err
    }
  }

  async findMany(post_ids:Array<number>){
    try{
      return this.dbService.execute(
        `SELECT * FROM like WHERE post_id IN (?)`,
        [post_ids]
        )
    }
    catch(err){
      throw err
    }
} 

  async findManyByUser(user_id:number, post_ids:Array<number>):Promise<Array<Like>>{
      try{
        const result = await this.dbService.execute(
          `SELECT * FROM like WHERE post_id IN (?) AND user_id = ?`,
          [post_ids, user_id]
        )

        return result[0][0]
      }
      catch(err){
        throw err
      }
  }


}
