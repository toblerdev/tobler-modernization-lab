import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';

import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Company } from '../entities/company.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}


  async create(createContactDto: CreateContactDto) {
    const company = await this.companyRepository.findOne({
      where: { companyId: createContactDto.companyId },
    });
    
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const contact = this.contactRepository.create({
      contactName: createContactDto.contactName,
      email: createContactDto.email,
      phone: createContactDto.phone,
      role: createContactDto.role,
      company,
    });

    return this.contactRepository.save(contact);
  }

  findAll(companyId?: number) {
    if (companyId) {
      return this.contactRepository.find({
        where: {
          company: {
            companyId: companyId,
          },
        },
        relations: {
          company: true,
        },
      });
    }
    return this.contactRepository.find({
      relations: {
        company: true,
      },
    });
  }

  async findOne(id: number) {
    const contact = await this.contactRepository.findOne({
      where: { contactId: id },
      relations: ['company'],
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    const contact = await this.contactRepository.findOne({
      where: { contactId: id },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    Object.assign(contact, updateContactDto);
    return this.contactRepository.save(contact);
  }

  async remove(id: number) {
    const contact = await this.contactRepository.findOne({
      where: { contactId: id },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return this.contactRepository.remove(contact);
  }
}
