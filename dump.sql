drop table if exists `user`;

create table if not exists `user`(
  `id` int not null AUTO_INCREMENT,
  `username` varchar not null,
  `full_name` varchar,
  `profile_picture` varchar,
  `bio` varchar,
  `created_at` datetime default CURRENT_TIMESTAMP,
  primary key (`id`)
)

create table if not exists `post`(
    `id` int not null AUTO_INCREMENT,
    `description` varchar,
    `user_id` int not null,
    `image` varchar,
    `created_at` datetime default CURRENT_TIMESTAMP,
    primary key (`id`)
    foreign key (`user_id`) references user(`id`)
)

create table if not exists `like`(
    `id` int not null AUTO_INCREMENT,
    `post_id` int not null,
    `user_id` int not null,
    `created_at` datetime default CURRENT_TIMESTAMP,
    primary key (`id`),
    foreign key (`post_id`) references post(`id`),
    foreign key (`user_id`) references user(`id`),
)

create table if not exists `follow`(
    `following_id` foreign key references user(`id`),
    `follower_id` foreign key references user(`id`),
    `created_at` datetime default CURRENT_TIMESTAMP
)