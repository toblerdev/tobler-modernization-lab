import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CrmService } from './crm.service';
import { Company } from './entities/company.entity';

describe('CrmService', () => {
  let service: CrmService;

  const mockCompanyRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrmService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    service = module.get<CrmService>(CrmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all companies', async () => {
    const companies = [ 
      {
        companyId: 1,
        companyName: 'Test Company 1',
        officeLocation: 'Taichung City',
        industry: 'Manufacturing',
      },
      {
        companyId: 2,
        companyName: 'Test Company 2',
        officeLocation: 'Taipei City',
        industry: 'Technology',
      },
    ];
    
    mockCompanyRepository.find.mockResolvedValue(companies);
    const result = await service.findAllCompanies();
    expect(mockCompanyRepository.find).toHaveBeenCalled();
    expect(result).toEqual(companies);

  });

  it('should create a new company', async () => {
    const companyData = {
      companyName: 'New Test Company',
      officeLocation: 'Taichung City',
      industry: 'Manufacturing',  
    };  

    const createdCompany = {
      companyId: 1,
      ...companyData,
    };

    mockCompanyRepository.create.mockReturnValue(createdCompany);
    mockCompanyRepository.save.mockResolvedValue(createdCompany);
    
    const result = await service.createCompany(companyData);
    expect(mockCompanyRepository.create).toHaveBeenCalledWith(companyData);
    expect(mockCompanyRepository.save).toHaveBeenCalledWith(createdCompany);
    expect(result).toEqual(createdCompany);
  });
  
  it('should delete a company', async () => {
    mockCompanyRepository.delete.mockResolvedValue({affected: 1});
    await service.deleteCompany(5);
    expect(mockCompanyRepository.delete).toHaveBeenCalledWith(5);
  });
    
  it('should update a company', async () => {
  const updateData = {
    companyName: 'Updated Company',
  };

  const updatedCompany = {
    companyId: 5,
    companyName: 'Updated Company',
    officeLocation: 'Taichung City',
    industry: 'Manufacturing',
  };

  mockCompanyRepository.update.mockResolvedValue({ affected: 1 });
  mockCompanyRepository.findOneBy.mockResolvedValue(updatedCompany);

  const result = await service.updateCompany(5, updateData);

  expect(mockCompanyRepository.update).toHaveBeenCalledWith(
    5,
    updateData,
  );

  expect(mockCompanyRepository.findOneBy).toHaveBeenCalledWith({
    companyId: 5,
  });

  expect(result).toEqual(updatedCompany);
  });

});
