import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CrudService } from 'src/crud/crud.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PasswordsService } from './passwords/passwords.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, CrudService, PasswordsService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
