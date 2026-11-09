
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CompanyInputDto } from './dto/company-input.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../crm/entities/company.entity';
import { OutreachEvent } from './entities/outreach-event.entity';
import { RecommendationRule } from './entities/recommendation-rule.entity';
import { CampaignRuleOverride } from './entities/campaign-rule-override.entity';
import { BadGatewayException, ServiceUnavailableException, } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Campaign } from './entities/campaign.entity';
import { GenerateOutreachDraftDto } from './dto/generate-outreach-draft.dto';

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(OutreachEvent)
    private readonly outreachEventRepository: Repository<OutreachEvent>,

    @InjectRepository(RecommendationRule)
    private readonly recommendationRuleRepository: Repository<RecommendationRule>,

    @InjectRepository(CampaignRuleOverride)
    private readonly campaignRuleOverrideRepository: Repository<CampaignRuleOverride>,

    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async getCampaigns(): Promise<Campaign[]> {
      return this.campaignRepository.find({
          select: {
              campaignId: true,
              campaignName: true,
              targetMarket: true,
          },
          order: {
              campaignId: 'ASC',
          },
      });
  }

  async rankCompanies(request: {
    campaignId: number;
    targetMarket: string;
    evaluationDate: string;
    rules: unknown[];
    companies: unknown[];
  }): Promise<unknown> {
    const springBootUrl = this.configService.get<string>(
      'SPRING_BOOT_URL',
      'http://localhost:8080',
    );

    const url = `${springBootUrl}/api/recommendations/companies`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, request),
      );

      return response.data;
    } catch (error: unknown) {
      if (
        error instanceof AxiosError &&
        !error.response
      ) {
        throw new ServiceUnavailableException(
          'Spring Boot recommendation service is unavailable',
        );
      }

      throw new BadGatewayException(
        'Spring Boot recommendation service failed',
      );
    }
  }

  async generateOutreachDraft(
    request: GenerateOutreachDraftDto,
  ): Promise<{ draft: string }> {

    const springBootUrl = this.configService.get<string>(
      'SPRING_BOOT_URL',
      'http://localhost:8080',
    );

    const url = `${springBootUrl}/ai/outreach-draft`;

    try {
      const response = await firstValueFrom(
        this.httpService.post<{ draft: string }>(
          url,
          request,
          { timeout: 30000 },
        ),
      );

      return response.data;

    } catch (error: unknown) {

      if (error instanceof AxiosError && !error.response) {
        throw new ServiceUnavailableException(
          'AI outreach service is unavailable',
        );
      }

      throw new BadGatewayException(
        'AI outreach generation failed',
      );
    }
  }

  mapCompanyToScoringInput(company: {
    companyId: number;
    companyName: string;
    industry: string;
    contacts: { email: string }[];
  }): CompanyInputDto {
    const hasUsableContact = company.contacts.some(
      (contact) => Boolean(contact.email?.trim()),
    );

    return {
      companyId: company.companyId,
      companyName: company.companyName,
      targetGroup: company.industry,
      hasUsableContact,
      hasOutreachHistory: false,
      nextFollowUpDate: null,
    };
  }

  async getCompaniesForScoring(): Promise<CompanyInputDto[]> {
    // Retrieve companies and their contacts
    const companies = await this.companyRepository.find({
      relations: ['contacts'],
    });

    // Retrieve outreach events in one database query
    const outreachEvents = await this.outreachEventRepository.find();

    // Build a Set containing company IDs with outreach history
    const contactedCompanyIds = new Set(
      outreachEvents.map((event) => event.companyId),
    );

    const followUpDatesByCompany = new Map<number, string>();

    for (const event of outreachEvents) {
      if (!event.followUpDate) {
        continue;
      }

      const existingDate = followUpDatesByCompany.get(event.companyId);

      if (!existingDate || event.followUpDate > existingDate) {
        followUpDatesByCompany.set(event.companyId, event.followUpDate);
      }
    }

    // Map each company to the Spring Boot scoring format
    return companies.map((company) => {
      const scoringInput = this.mapCompanyToScoringInput(company);

      scoringInput.hasOutreachHistory =
        contactedCompanyIds.has(company.companyId);

      scoringInput.nextFollowUpDate =
        followUpDatesByCompany.get(company.companyId) ?? null;

      return scoringInput;
    });
  }

  async getOutreachEventsForCompany(
    companyId: number,
  ): Promise<OutreachEvent[]> {
    return this.outreachEventRepository.find({
      where: { companyId },
    });
  }

  async hasOutreachHistory(companyId: number): Promise<boolean> {
    const outreachEvents =
      await this.getOutreachEventsForCompany(companyId);

    return outreachEvents.length > 0;
  }

  async getGlobalScoringRules(): Promise<RecommendationRule[]> {
    return this.recommendationRuleRepository.find();
  }

  async getCampaignRuleOverrides(
    campaignId: number,
  ): Promise<CampaignRuleOverride[]> {
    return this.campaignRuleOverrideRepository.find({
      where: { campaignId },
    });
  }

  async getEffectiveScoringRules(
    campaignId: number,
  ): Promise<{ code: string; weight: number; enabled: boolean }[]> {
    const [globalRules, overrides] = await Promise.all([
      this.getGlobalScoringRules(),
      this.getCampaignRuleOverrides(campaignId),
    ]);

    const overridesByRuleId = new Map(
      overrides.map((override) => [override.ruleId, override]),
    );

    return globalRules.map((rule) => {
      const override = overridesByRuleId.get(rule.ruleId);

      return {
        code: rule.ruleCode,
        weight: override?.weightOverride ?? rule.defaultWeight,
        enabled: override?.enabledOverride ?? rule.enabled,
      };
    });
  }

  async buildScoringRequest(
    campaignId: number,
    targetMarket: string,
    evaluationDate: string,
  ) {
    const [rules, companies] = await Promise.all([
      this.getEffectiveScoringRules(campaignId),
      this.getCompaniesForScoring(),
    ]);

    return {
      campaignId,
      targetMarket,
      evaluationDate,
      rules,
      companies,
    };
  }


}
