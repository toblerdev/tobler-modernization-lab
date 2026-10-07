import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { Contact } from './entities/contact.entity';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from '../entities/company.entity';


describe('ContactService', () => {
  let service: ContactService;

  const mockContactRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  }

  const mockCompanyRepository = {
    findOne: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      // providers: [ContactService],
      providers: [
        ContactService,
        {
          provide: getRepositoryToken(Contact),
          useValue: mockContactRepository,
        },
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all contacts', async () => {
    const contacts = [
      {
        contactId: 1,
        contactName: 'John Doe',
        email: 'test@email.com',
        phone: '1234567890',
        role: 'Manager',
        company: {
          companyId: 1,
        },
      },
    ];

    mockContactRepository.find.mockResolvedValue(contacts);
    const result = await service.findAll();
    expect(mockContactRepository.find).toHaveBeenCalledWith(
      {
        relations: {
          company: true,
        }
      });
    expect(result).toEqual(contacts);
  });

  it('should return contacts for a specific company', async () => {
    const contacts = [
      {
        contactId: 1,
        contactName: 'John Doe',
        email: 'test@email.com',
        phone: '1234567890',
        role: 'Manager',
        company: {
          companyId: 1,
        },
      },
    ];
  
    mockContactRepository.find.mockResolvedValue(contacts);
    
    const result = await service.findAll(1);
    expect(mockContactRepository.find).toHaveBeenCalledWith({
      where: {
        company: {
          companyId: 1,
        },
      },
      relations: {
        company: true,
      },
    });
    expect(result).toEqual(contacts);
  }); 

  it('should create a contact', async () => {
    const company = {
      companyId: 1,
      companyName: 'Test Company',
      officeLocation: 'Taichung City',
      industry: 'Manufacturing',
    };

    const createContactDto = {
      contactName: 'John Doe',
      email: 'test@email.com',
      phone: '1234567890',
      role: 'Manager',
      companyId: 1,
    };

    const createdContact = {
      contactId: 1,
      ...createContactDto,
      company,
    };

      mockCompanyRepository.findOne.mockResolvedValue(company);
    mockContactRepository.create.mockReturnValue(createdContact);
    mockContactRepository.save.mockResolvedValue(createdContact);

    const result = await service.create(createContactDto);

    expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
      where: { companyId: 1 },
    });

    expect(mockContactRepository.create).toHaveBeenCalledWith({
      contactName: 'John Doe',
      email: 'test@email.com',
      phone: '1234567890',
      role: 'Manager',
      company,
    });

    expect(mockContactRepository.save).toHaveBeenCalledWith(createdContact);

    expect(result).toEqual(createdContact);
  
    });

    it('should throw NotFoundException when company is not found', async () => {
    const createContactDto = {
      companyId: 999,
      contactName: 'John Doe',
      email: 'test@email.com',
      phone: '1234567890',
      role: 'Manager',
    };

    mockCompanyRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create(createContactDto),
    ).rejects.toThrow('Company not found');

    expect(mockContactRepository.create).not.toHaveBeenCalled();
    expect(mockContactRepository.save).not.toHaveBeenCalled();

  });

    it('should return one contact', async () => {
    const contact = {
      contactId: 1,
      contactName: 'John Doe',
      email: 'test@email.com',
      phone: '1234567890',
      role: 'Manager',
      company: {
        companyId: 1,
      },
    };

    mockContactRepository.findOne.mockResolvedValue(contact);

    const result = await service.findOne(1);

    expect(mockContactRepository.findOne).toHaveBeenCalledWith({
      where: { contactId: 1 },
      relations: ['company'],
    });

    expect(result).toEqual(contact);
  });

  it('should throw NotFoundException when contact is not found', async () => {
    mockContactRepository.findOne.mockResolvedValue(null);

    await expect(
      service.findOne(999),
    ).rejects.toThrow('Contact not found');

    expect(mockContactRepository.findOne).toHaveBeenCalledWith({
      where: { contactId: 999 },
      relations: ['company'],
    });
  });

  it('should update a contact', async () => {
  const contact = {
    contactId: 1,
    contactName: 'John Doe',
    email: 'test@email.com',
    phone: '1234567890',
    role: 'Manager',
  };

  const updateContactDto = {
    role: 'Director',
  };

  const updatedContact = {
    ...contact,
    role: 'Director',
  };

  mockContactRepository.findOne.mockResolvedValue(contact);
  mockContactRepository.save.mockResolvedValue(updatedContact);

  const result = await service.update(1, updateContactDto);

  expect(mockContactRepository.findOne).toHaveBeenCalledWith({
    where: { contactId: 1 },
  });

  expect(mockContactRepository.save).toHaveBeenCalledWith(updatedContact);

  expect(result).toEqual(updatedContact);
  });  

  it('should throw NotFoundException when updating a contact that is not found', async () => {
  const updateContactDto = {
    role: 'Director',
  };

  mockContactRepository.findOne.mockResolvedValue(null);

  await expect(
    service.update(999, updateContactDto),
  ).rejects.toThrow('Contact not found');

  expect(mockContactRepository.findOne).toHaveBeenCalledWith({
    where: { contactId: 999 },
  });

  expect(mockContactRepository.save).not.toHaveBeenCalled();
  });

  it('should remove a contact', async () => {
  const contact = {
    contactId: 1,
    contactName: 'John Doe',
    email: 'test@email.com',
    phone: '1234567890',
    role: 'Manager',
  };

  mockContactRepository.findOne.mockResolvedValue(contact);
  mockContactRepository.remove.mockResolvedValue(contact);

  const result = await service.remove(1);

  expect(mockContactRepository.findOne).toHaveBeenCalledWith({
    where: { contactId: 1 },
  });

  expect(mockContactRepository.remove).toHaveBeenCalledWith(contact);

  expect(result).toEqual(contact);
  });

  it('should throw NotFoundException when removing a contact that is not found', async () => {
  mockContactRepository.findOne.mockResolvedValue(null);

  await expect(
    service.remove(999),
  ).rejects.toThrow('Contact not found');

  expect(mockContactRepository.findOne).toHaveBeenCalledWith({
    where: { contactId: 999 },
  });

  expect(mockContactRepository.remove).not.toHaveBeenCalled();
  });

});
