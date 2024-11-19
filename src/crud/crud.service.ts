// create a global curd service to apply to all modules, and apply the DRY principle
// import { Model } from 'mongoose';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

export class CrudService {
  //   constructor(private readonly model: Model<any>) {} // mongoose
  constructor(private readonly model: Repository<any>) {} // typeorm

  // if using typeorm
  async create(data: any, errorMessage: string) {
    const newModel = this.model.create(data);
    if (!newModel) {
      throw new UnprocessableEntityException(errorMessage);
    }

    const savedModel = await this.model.save(newModel);

    return savedModel;
  }

  async findAll(message: string): Promise<any[]> {
    const models = await this.model.find();

    if (!models) {
      throw new NotFoundException(message);
    }

    return models;
  }

  async findOne(id: number, message: string): Promise<any> {
    const user = await this.model.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(message);
    }

    return user;
  }

  async update(id: number, data: any): Promise<any> {
    await this.findOne(id, `Entity with id ${id} not found to be updated`); // if not found it will throw an error

    return await this.model.update(id, data);
  }

  async delete(id: number): Promise<any> {
    await this.findOne(id, `Entity with id ${id} not found to be deleted`); // if not found it will throw an error

    return await this.model.delete(id);
  }

  // if using mongoose
  //   async create(data: any) {
  //     const newModel = new this.model(data);
  //     return await newModel.save();
  //   }

  //   async findAll() {
  //     return await this.model.find();
  //   }

  //   async findOne(id: string) {
  //     return await this.model.findById(id);
  //   }

  //   async update(id: string, data: any) {
  //     return await this.model.findByIdAndUpdate(id, data, { new: true });
  //   }

  //   async delete(id: string) {
  //     return await this.model.findByIdAndRemove(id);
  //   }
}
