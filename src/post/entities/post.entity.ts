import { User } from "src/user/entities/user.entity";


export class Post {
    id:number;
    description:string;
    user_id:number;
    image:string;
    created_at:number;
    liked:boolean
}

export class Post_Owner {
    id: number;
    description: string;
    image: string;
    created_at: number;
    liked: boolean;
    owner: Owner
}

export class Owner{
    id: number;
    username: string;
    full_name: string;
    profile_picture: string;
    followed: boolean;
}

