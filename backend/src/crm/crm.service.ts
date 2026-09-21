import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class CrmService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  findAllCompanies(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  createCompany(companyData: Partial<Company>): Promise<Company> {
  const company = this.companyRepository.create(companyData);
  return this.companyRepository.save(company);
  }

  async deleteCompany(id: number): Promise<void> {
    await this.companyRepository.delete(id);
  }

  async updateCompany (
    id: number,
    updateData: {
      companyName?: string;
      officeLocation?: string;
      industry?: string;
    },
  )
  {

    await this.companyRepository.update(id, updateData);
    return this.companyRepository.findOneBy({ companyId: id });
  }   
} 