import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { RecommendationsService } from './recommendations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from '../crm/entities/company.entity';
import { OutreachEvent } from './entities/outreach-event.entity';
import { RecommendationRule } from './entities/recommendation-rule.entity';
import { CampaignRuleOverride } from './entities/campaign-rule-override.entity';
import { Campaign } from './entities/campaign.entity';

describe('RecommendationsService', () => {
  let service: RecommendationsService;

  const mockHttpService = {
    post: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('http://localhost:8080'),
  };

  const companyRepository = {
  find: jest.fn(),
};

const outreachEventRepository = {
  find: jest.fn(),
};

const recommendationRuleRepository = {
  find: jest.fn(),
};

const campaignRuleOverrideRepository = {
  find: jest.fn(),
};

const campaignRepository = {
  find: jest.fn(),
};

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: getRepositoryToken(Company), useValue: companyRepository},
        { provide: getRepositoryToken(OutreachEvent), useValue: outreachEventRepository },
        { provide: getRepositoryToken(RecommendationRule), useValue: recommendationRuleRepository, },
        { provide: getRepositoryToken(CampaignRuleOverride), useValue: campaignRuleOverrideRepository, },
        { provide: getRepositoryToken(Campaign), useValue: campaignRepository, },
      ],
    }).compile();

    service = module.get<RecommendationsService>(
      RecommendationsService,
    );
  });

  it('should send recommendations to Spring Boot', async () => {
    const request = {
      campaignId: 1,
      targetMarket: 'Machine Tools/CNC',
      evaluationDate: '2026-10-30',
      rules: [],
      companies: [],
    };

    const response = {
      campaignId: 1,
      recommendations: [],
    };

    mockHttpService.post.mockReturnValue(
      of({ data: response } as AxiosResponse),
    );

    const result = await service.rankCompanies(request);

    expect(mockHttpService.post).toHaveBeenCalledWith(
      'http://localhost:8080/api/recommendations/companies',
      request,
    );

    expect(result).toEqual(response);
  });


  it('should map a company entity to a scoring input', () => {
    const company = {
      companyId: 101,
      companyName: 'ABC Manufacturing',
      industry: 'Machine Tools/CNC',
      contacts: [
        {
          contactId: 1,
          email: 'contact@example.com',
        },
      ],
    };

    const result = service.mapCompanyToScoringInput(company);

    expect(result).toEqual({
      companyId: 101,
      companyName: 'ABC Manufacturing',
      targetGroup: 'Machine Tools/CNC',
      hasUsableContact: true,
      hasOutreachHistory: false,
      nextFollowUpDate: null,
    });
  });


  it('should identify a company without usable contacts', () => {
    const company = {
      companyId: 102,
      companyName: 'XYZ Manufacturing',
      industry: 'Machine Tools/CNC',
      contacts: [
        {
          email: '',
        },
        {
          email: '   ',
        },
      ],
    };

    const result = service.mapCompanyToScoringInput(company);

    expect(result.hasUsableContact).toBe(false);
    expect(result.companyId).toBe(102);
    expect(result.targetGroup).toBe('Machine Tools/CNC');
  });


  it('should load companies with their contacts', async () => {
    const companies = [
      {
        companyId: 101,
        companyName: 'ABC Manufacturing',
        industry: 'Machine Tools/CNC',
        contacts: [
          {
            email: 'contact@example.com',
          },
        ],
      },
    ];

    companyRepository.find.mockResolvedValue(companies);
    outreachEventRepository.find.mockResolvedValue([]);
    const result = await service.getCompaniesForScoring();

    expect(companyRepository.find).toHaveBeenCalledWith({
      relations: ['contacts'],
    });

    expect(result).toEqual([
      {
        companyId: 101,
        companyName: 'ABC Manufacturing',
        targetGroup: 'Machine Tools/CNC',
        hasUsableContact: true,
        hasOutreachHistory: false,
        nextFollowUpDate: null,
      },
    ]);
  });


  it('should retrieve outreach events for a company', async () => {
    const outreachEvents = [
      {
        outreachEventId: 3,
        companyId: 2,
        outreachType: 'Email',
        outreachStatus: 'Initial Email Sent',
        outreachDate: '2026-05-12',
        followUpDate: null,
      },
    ];

    outreachEventRepository.find.mockResolvedValue(outreachEvents);

    const result = await service.getOutreachEventsForCompany(2);

    expect(outreachEventRepository.find).toHaveBeenCalledWith({
      where: { companyId: 2 },
    });

    expect(result).toEqual(outreachEvents);
  });

  it('should identify a company with outreach history', async () => {
    const outreachEvents = [
      {
        outreachEventId: 3,
        companyId: 2,
        outreachType: 'Email',
        outreachStatus: 'Initial Email Sent',
        outreachDate: '2026-05-12',
        followUpDate: null,
      },
    ];

    outreachEventRepository.find.mockResolvedValue(outreachEvents);

    const result = await service.hasOutreachHistory(2);

    expect(result).toBe(true);

    expect(outreachEventRepository.find).toHaveBeenCalledWith({
      where: { companyId: 2 },
    });
  });

  it('should identify a company with no outreach history', async () => {
    outreachEventRepository.find.mockResolvedValue([]);

    const result = await service.hasOutreachHistory(101);

    expect(result).toBe(false);

    expect(outreachEventRepository.find).toHaveBeenCalledWith({
      where: { companyId: 101 },
    });
  });


  it('should map outreach history for multiple companies', async () => {
    const companies = [
      {
        companyId: 2,
        companyName: 'ABC Manufacturing',
        industry: 'Machine Tools/CNC',
        contacts: [{ email: 'abc@example.com' }],
      },
      {
        companyId: 101,
        companyName: 'XYZ Manufacturing',
        industry: 'Manufacturing',
        contacts: [],
      },
    ];

    const outreachEvents = [
      {
        outreachEventId: 3,
        companyId: 2,
        followUpDate: null,
      },
    ];

    companyRepository.find.mockResolvedValue(companies);
    outreachEventRepository.find.mockResolvedValue(outreachEvents);

    const result = await service.getCompaniesForScoring();

    expect(outreachEventRepository.find).toHaveBeenCalledTimes(1);

    expect(result).toEqual([
      {
        companyId: 2,
        companyName: 'ABC Manufacturing',
        targetGroup: 'Machine Tools/CNC',
        hasUsableContact: true,
        hasOutreachHistory: true,
        nextFollowUpDate: null,
      },
      {
        companyId: 101,
        companyName: 'XYZ Manufacturing',
        targetGroup: 'Manufacturing',
        hasUsableContact: false,
        hasOutreachHistory: false,
        nextFollowUpDate: null,
      },
    ]);
  });


  it('should return null when no follow-up is scheduled', async () => {
    const companies = [
      {
        companyId: 2,
        companyName: 'ABC Manufacturing',
        industry: 'Manufacturing',
        contacts: [],
      },
    ];

    const outreachEvents = [
      {
        outreachEventId: 3,
        companyId: 2,
        followUpDate: null,
      },
    ];

    companyRepository.find.mockResolvedValue(companies);
    outreachEventRepository.find.mockResolvedValue(outreachEvents);

    const result = await service.getCompaniesForScoring();

    expect(result[0].hasOutreachHistory).toBe(true);
    expect(result[0].nextFollowUpDate).toBeNull();
  });

  it('should retrieve global scoring rules', async () => {
    const mockRules = [
      {
        ruleId: 1,
        ruleCode: 'TARGET_MARKET_MATCH',
        description: 'Company matches the target market',
        defaultWeight: 25,
        enabled: true,
      },
      {
        ruleId: 2,
        ruleCode: 'CONTACT_AVAILABLE',
        description: 'Company has a usable contact',
        defaultWeight: 15,
        enabled: true,
      },
    ];

    recommendationRuleRepository.find.mockResolvedValue(mockRules);

    const result = await service.getGlobalScoringRules();

    expect(recommendationRuleRepository.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockRules);
  });

  it('should retrieve overrides for a campaign', async () => {
    const overrides = [
      {
        overrideId: 1,
        campaignId: 1,
        ruleId: 1,
        weightOverride: 40,
        enabledOverride: null,
      },
    ];

    campaignRuleOverrideRepository.find.mockResolvedValue(overrides);

    const result = await service.getCampaignRuleOverrides(1);

    expect(campaignRuleOverrideRepository.find).toHaveBeenCalledWith({
      where: { campaignId: 1 },
    });

    expect(result).toEqual(overrides);
  });

  it('should apply campaign overrides to global rules', async () => {
    recommendationRuleRepository.find.mockResolvedValue([
      {
        ruleId: 1,
        ruleCode: 'TARGET_MARKET_MATCH',
        defaultWeight: 25,
        enabled: true,
      },
      {
        ruleId: 2,
        ruleCode: 'CONTACT_AVAILABLE',
        defaultWeight: 15,
        enabled: true,
      },
    ]);

    campaignRuleOverrideRepository.find.mockResolvedValue([
      {
        campaignId: 1,
        ruleId: 1,
        weightOverride: 40,
        enabledOverride: null,
      },
    ]);

    const result = await service.getEffectiveScoringRules(1);

    expect(result).toEqual([
      {
        code: 'TARGET_MARKET_MATCH',
        weight: 40,
        enabled: true,
      },
      {
        code: 'CONTACT_AVAILABLE',
        weight: 15,
        enabled: true,
      },
    ]);
  });

  it('should preserve zero weights and disabled overrides', async () => {
    recommendationRuleRepository.find.mockResolvedValue([
      {
        ruleId: 1,
        ruleCode: 'NEVER_CONTACTED',
        defaultWeight: 20,
        enabled: true,
      },
    ]);

    campaignRuleOverrideRepository.find.mockResolvedValue([
      {
        campaignId: 1,
        ruleId: 1,
        weightOverride: 0,
        enabledOverride: false,
      },
    ]);

    const result = await service.getEffectiveScoringRules(1);

    expect(result).toEqual([
      {
        code: 'NEVER_CONTACTED',
        weight: 0,
        enabled: false,
      },
    ]);
  });

  it('should build a complete scoring request', async () => {
    const rules = [
      {
        code: 'TARGET_MARKET_MATCH',
        weight: 40,
        enabled: true,
      },
    ];

    const companies = [
      {
        companyId: 2,
        companyName: 'ABC Manufacturing',
        targetGroup: 'Manufacturing',
        hasUsableContact: true,
        hasOutreachHistory: true,
        nextFollowUpDate: null,
      },
    ];

    jest
      .spyOn(service, 'getEffectiveScoringRules')
      .mockResolvedValueOnce(rules);

    jest
      .spyOn(service, 'getCompaniesForScoring')
      .mockResolvedValueOnce(companies);

    const result = await service.buildScoringRequest(
      1,
      'Manufacturing',
      '2026-11-02',
    );

    expect(result).toEqual({
      campaignId: 1,
      targetMarket: 'Manufacturing',
      evaluationDate: '2026-11-02',
      rules,
      companies,
    });
  });

  it('should use the latest follow-up date for each company', async () => {
    const companies = [
      {
        companyId: 101,
        companyName: 'ABC Manufacturing',
        industry: 'Machine Tools / CNC',
        contacts: [],
      },
      {
        companyId: 102,
        companyName: 'XYZ Manufacturing',
        industry: 'Machine Tools / CNC',
        contacts: [],
      },
    ];

    const outreachEvents = [
      {
        companyId: 101,
        followUpDate: '2026-11-05',
      },
      {
        companyId: 101,
        followUpDate: '2026-11-12',
      },
      {
        companyId: 101,
        followUpDate: null,
      },
      {
        companyId: 102,
        followUpDate: null,
      },
    ];

    companyRepository.find.mockResolvedValue(companies);
    outreachEventRepository.find.mockResolvedValue(outreachEvents);

    const result = await service.getCompaniesForScoring();

    expect(result).toHaveLength(2);

    expect(result[0].nextFollowUpDate).toBe('2026-11-12');
    expect(result[0].hasOutreachHistory).toBe(true);

    expect(result[1].nextFollowUpDate).toBeNull();
    expect(result[1].hasOutreachHistory).toBe(true);
  });

});
