import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'

import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

import { Contact } from './entities/contact.entity';
import { Company } from '../entities/company.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Contact, Company])],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
