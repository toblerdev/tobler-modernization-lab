import { Test, TestingModule } from '@nestjs/testing';
import { CrmController } from './crm.controller';
import { CrmService } from './crm.service';

describe('CrmController', () => {
  let controller: CrmController;

  const mockCrmService = {
    findAllCompanies: jest.fn(),
    createCompany: jest.fn(),
    deleteCompany: jest.fn(),
    updateCompany: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrmController],
      providers: [
        {
          provide: CrmService,
          useValue: mockCrmService,
        },
      ],
    }).compile();

    controller = module.get<CrmController>(CrmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all companies', async () => {
    const companies = [
      {
        companyId: 1,
        companyName: 'Test Company',
        officeLocation: 'Taichung City',
        industry: 'Manufacturing',
      },
    ];

    mockCrmService.findAllCompanies.mockResolvedValue(companies);

    const result = await controller.getCompanies();

    expect(mockCrmService.findAllCompanies).toHaveBeenCalled();
    expect(result).toEqual(companies);
  });

  it('should create a company', async () => {
    const createCompanyDto = {
      companyName: 'Test Company',
      officeLocation: 'Taichung City',
      industry: 'Manufacturing',
    };

    const createdCompany = {
      companyId: 1,
      ...createCompanyDto,
    };

    mockCrmService.createCompany.mockResolvedValue(createdCompany);

    const result = await controller.createCompany(createCompanyDto);

    expect(mockCrmService.createCompany).toHaveBeenCalledWith(
      createCompanyDto,
    );

    expect(result).toEqual(createdCompany);
  });

  it('should delete a company', async () => {
    mockCrmService.deleteCompany.mockResolvedValue(undefined);

    await controller.deleteCompany('5');

    expect(mockCrmService.deleteCompany).toHaveBeenCalledWith(5);
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

    mockCrmService.updateCompany.mockResolvedValue(updatedCompany);

    const result = await controller.updateCompany('5', updateData);

    expect(mockCrmService.updateCompany).toHaveBeenCalledWith(
      5,
      updateData,
    );

    expect(result).toEqual(updatedCompany);
  });  
});