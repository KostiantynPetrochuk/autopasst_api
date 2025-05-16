import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  findAll(): Promise<Profile[]> {
    return this.profilesRepository.find();
  }

  findOneByLogin(login: string): Promise<Profile | null> {
    return this.profilesRepository.findOneBy({ login });
  }

  async createProfile(
    login: string,
    hashPwd: string,
    salt: string,
  ): Promise<Profile | null> {
    return await this.profilesRepository.save({ login, hashPwd, salt });
  }

  async deleteById(id: number): Promise<void> {
    await this.profilesRepository.delete(id);
  }
}
