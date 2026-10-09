import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

describe('ContactController', () => {
  let controller: ContactController;

  const mockContactService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        {
          provide: ContactService,
          useValue: mockContactService,
        },
      ],
    }).compile();

    controller = module.get<ContactController>(ContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a contact', async () => {
    const createContactDto = {
      companyId: 1,
      contactName: 'John Smith',
      email: 'john@example.com',
      phone: '555-1234',
      role: 'Manager',
    };

    const createdContact = {
      contactId: 1,
      contactName: 'John Smith',
      email: 'john@example.com',
      phone: '555-1234',
      role: 'Manager',
    };

    mockContactService.create.mockResolvedValue(createdContact);

    const result = await controller.create(createContactDto);

    expect(mockContactService.create).toHaveBeenCalledWith(
      createContactDto,
    );

    expect(result).toEqual(createdContact);
  });  

  it('should return all contacts', async () => {
    const contacts = [
      {
        contactId: 1,
        contactName: 'John Smith',
        email: 'john@example.com',
        phone: '555-1234',
        role: 'Manager',
      },
    ];

    mockContactService.findAll.mockResolvedValue(contacts);

    const result = await controller.findAll();

    expect(mockContactService.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(contacts);
  });

  it('should return contacts for a specific company', async () => {
    const contacts = [
      {
        contactId: 1,
        contactName: 'John Smith',
        email: 'john@example.com',
        phone: '555-1234',
        role: 'Manager',
      },
    ];

    mockContactService.findAll.mockResolvedValue(contacts);

    const result = await controller.findAll('5');

    expect(mockContactService.findAll).toHaveBeenCalledWith(5);
    expect(result).toEqual(contacts);
  });

  it('should return one contact', async () => {
    const contact = {
      contactId: 1,
      contactName: 'John Smith',
      email: 'john@example.com',
      phone: '555-1234',
      role: 'Manager',
    };

    mockContactService.findOne.mockResolvedValue(contact);

    const result = await controller.findOne('1');

    expect(mockContactService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(contact);
  });  

  it('should update a contact', async () => {
    const updateContactDto = {
      role: 'Director',
    };

    const updatedContact = {
      contactId: 1,
      contactName: 'John Smith',
      email: 'john@example.com',
      phone: '555-1234',
      role: 'Director',
    };

    mockContactService.update.mockResolvedValue(updatedContact);

    const result = await controller.update('1', updateContactDto);

    expect(mockContactService.update).toHaveBeenCalledWith(
      1,
      updateContactDto,
    );

    expect(result).toEqual(updatedContact);
  });

  it('should remove a contact', async () => {
    const removedContact = {
      contactId: 1,
      contactName: 'John Smith',
      email: 'john@example.com',
      phone: '555-1234',
      role: 'Director',
    };

    mockContactService.remove.mockResolvedValue(removedContact);

    const result = await controller.remove('1');

    expect(mockContactService.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(removedContact);
  });

});