import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CrudService } from 'src/crud/crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class UsersService extends CrudService {
  constructor(
    @InjectRepository(User) userEntity: Repository<User>,
    private readonly i18n: I18nService,
  ) {
    super(userEntity);
  }

  async createUser(createUserDto: CreateUserDto) {
    // add the rest of your logic here

    const pipe =
      (...fns) =>
      (value) =>
        fns.reduce((prev, fn) => {
          fn(prev);
        }, value);

    // inheret form the extened class
    return this.create(
      createUserDto,
      this.i18n.t('errors.UPROCESSAPLE_ENTITY', {
        lang: I18nContext.current().lang,
      }),
    );
  }

  async findAllUsers() {
    // add the of your logic here

    // inherit form the exteneded calss
    return this.findAll(
      this.i18n.t('errors.NOT_FOUND', {
        lang: I18nContext.current().lang,
      }),
    );
  }

  async findOneUser(id: number): Promise<string> {
    // add the rest of your logic here

    // inherit form the exteneded calss
    return this.findOne(
      id,
      this.i18n.t('errors.NOT_FOUND', {
        lang: I18nContext.current().lang,
      }),
    );
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<string> {
    // add the rest of your logic here

    // inherit form the exteneded calss
    return this.update(id, updateUserDto);
  }

  async deleteUser(id: number) {
    // add the rest of your logic here

    // inherit form the exteneded calss
    return this.delete(id);
  }
}
