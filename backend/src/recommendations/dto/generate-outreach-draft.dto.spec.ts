import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GenerateOutreachDraftDto } from './generate-outreach-draft.dto';

describe('GenerateOutreachDraftDto', () => {
  async function validateRequest(data: Record<string, unknown>) {
    const dto = plainToInstance(GenerateOutreachDraftDto, data);
    return validate(dto);
  }

  it('should accept a valid AI outreach request', async () => {
    const errors = await validateRequest({
      companyName: 'Giant Manufacturing',
      targetMarket: 'Bicycle Manufacturing',
    });

    expect(errors).toHaveLength(0);
  });

  it('should reject an empty company name', async () => {
    const errors = await validateRequest({
      companyName: '',
      targetMarket: 'Bicycle Manufacturing',
    });

    expect(errors.some(error => error.property === 'companyName'))
      .toBe(true);
  });

  it('should reject a missing target market', async () => {
    const errors = await validateRequest({
      companyName: 'Giant Manufacturing',
    });

    expect(errors.some(error => error.property === 'targetMarket'))
      .toBe(true);
  });

  it('should reject a company name longer than 200 characters', async () => {
    const errors = await validateRequest({
      companyName: 'A'.repeat(201),
      targetMarket: 'Bicycle Manufacturing',
    });

    expect(errors.some(error => error.property === 'companyName'))
      .toBe(true);
  });

  it('should reject a non-string target market', async () => {
    const errors = await validateRequest({
      companyName: 'Giant Manufacturing',
      targetMarket: 12345,
    });

    expect(errors.some(error => error.property === 'targetMarket'))
      .toBe(true);
  });
});