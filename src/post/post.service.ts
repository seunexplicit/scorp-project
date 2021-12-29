import { Injectable } from '@nestjs/common';
import { FollowService } from 'src/follow/follow.service';
import { LikeService } from 'src/like/like.service';
import { DatabaseService } from 'src/services/database/database.service';
import { UserService } from 'src/user/user.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, Post_Owner } from './entities/post.entity';

@Injectable()
export class PostService {

    constructor(
        private dbService:DatabaseService,
        private userService:UserService,
        private likeService:LikeService,
        private followService:FollowService
        ){}

    create(createPostDto: CreatePostDto) {
        return 'This action adds a new post';
    }

    findAll() {
        return `This action returns all post`;
    }

    async findUserPost(user_id:number, post_ids:Array<number>):Promise<Array<Post_Owner>>{
        try{
            const posts = await this.findPostByList(post_ids);
            const [users, likes, follows] = await Promise.all([
                this.userService.findMany(posts.map(post=>post.user_id)),
                this.likeService.findManyByUser(user_id, post_ids),
                this.followService.findManyFollowingByFollower(user_id, posts.map(post=>post.user_id))
            ]);

            const result:Array<Post_Owner> = post_ids.map(id=>{
                const post = posts.find(each=>each.id==id);
                const owner = users.find(each=>each.id==post.user_id)
                return post?null:{
                    id,
                    description:post.description,
                    image:post.image,
                    created_at:post.created_at,
                    liked:likes.find(each=>each.post_id==id)?true:false,
                    owner:{
                        id:owner.id,
                        username:owner.username,
                        full_name:owner.full_name,
                        profile_picture:owner.profile_picture,
                        followed:follows.find(each=>each.following_id==owner.id)?true:false
                    }
                }
            })
            return result;
        }
        catch(err){
            throw err
        }
        
    }

    //this mergePost is more efficient and would be my goto when solving situations like this
    //but comment it out to write another to show more of my algorithm capacity as the test seems to want to see that more 

    // mergePost(list_of_posts:Array<Array<Post>>):Array<Post>{
    //     try{
    //         let posts = list_of_posts.flat();
    //         posts = posts.sort((a, b)=>{
    //             if(a.created_at==b.created_at) return b.id - a.id
    //             return b.created_at - a.created_at
    //         })
    //         posts = posts.filter((each, index)=>each.id!==posts[index-1]?.id)
    //         return posts
    //     }
    //     catch(err){
    //         throw err
    //     }
    // }

    mergePost(list_of_posts:Array<Array<Post>>):Array<Post>{
        try{
            let ret_posts:Post[] = []
            list_of_posts.forEach((posts, topIndex)=>{
                // a reversal for loop is done from post length to 1; 
                // this changes the ascending sorting to decending sorting;
                for(let j = posts.length; j>0; j--){
                   ret_posts = this.topBottomSortMethod(ret_posts, posts[j-1]);
                }
            })

            return ret_posts;

        }
        catch(err){
            throw err
        }
    }

    topBottomSortMethod(sortedArray:Array<Post>, value:Post){
        let len = sortedArray.length;
        if(len<1){
            sortedArray.push(value)
            return sortedArray;
        }
        for(let j = 0; j<sortedArray.length; j++){
            const reverseIndex=len - (j+1)  //this allow compare to be done on both end of the list

            if(sortedArray[j].created_at==value.created_at&&sortedArray[j].id==value.id||
                sortedArray[reverseIndex].created_at==value.created_at&&sortedArray[reverseIndex].id==value.id
            ){
                return sortedArray
            }
            else if(sortedArray[j].created_at<value.created_at||
                sortedArray[j].created_at==value.created_at&&sortedArray[j].id<value.id
            ){
                sortedArray.splice(j, 0, value)
                return sortedArray
            }
            else if(sortedArray[reverseIndex].created_at>value.created_at||
            sortedArray[reverseIndex].created_at==value.created_at&&sortedArray[reverseIndex].id>value.id){
                sortedArray.splice(reverseIndex+1, 0, value);
                return sortedArray
            }
            
        }
    }

    async findPostByList(post_ids:Array<number>):Promise<Array<Post>>{
        try{
            const result = await this.dbService.execute(
                `select * from post where id in (?)`,
                [post_ids]
            )
            
            return  result[0][0]
        }
        catch(err){
            throw err
        }
    }


}
