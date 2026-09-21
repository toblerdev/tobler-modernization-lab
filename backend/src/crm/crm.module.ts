import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmController } from './crm.controller';
import { CrmService } from './crm.service';
import { Company } from './entities/company.entity';
import { ContactModule } from './contact/contact.module';
import { Contact } from './contact/entities/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Contact]), ContactModule],
  controllers: [CrmController],
  providers: [CrmService],
})
export class CrmModule {}