import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/services/database/database.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { Follow } from './entities/follow.entity';

@Injectable()
export class FollowService {

  constructor(private dbService:DatabaseService){}

  create(createFollowDto: CreateFollowDto) {
    return 'This action adds a new follow';
  }

  findAll() {
    try{
      return this.dbService.execute(`SELECT * FROM follow`)
    }
    catch(err){
      throw err
    }
  }

  findFollowers(following_id:number){
    try{
      return this.dbService.execute(`SELECT * FROM follow WHERE following_id = ?`, [following_id])
    }
    catch(err){
      throw err
    }
  }

  findFollowings(follower_id:number){
    try{
      return this.dbService.execute(`SELECT * FROM follow WHERE follower_id = ?`, [follower_id])
    }
    catch(err){
      throw err
    }
  }

  async findManyFollowingByFollower(follower_id:number, following_ids:Array<number>):Promise<Array<Follow>>{
    try{
      const result  = await this.dbService.execute(
        `SELECT * FROM follow WHERE follower_id = ? AND following_id IN (?) `,
        [follower_id, following_ids]
        )

        return result[0][0]
    }
    catch(err){
      throw err
    }
  }

}
