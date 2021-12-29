import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { DatabaseService } from './services/database/database.service';
import { LikeModule } from './like/like.module';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [PostModule, UserModule, LikeModule, FollowModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
