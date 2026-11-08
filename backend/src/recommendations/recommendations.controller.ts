
import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { RecommendationsService } from './recommendations.service';
import { CompanyRecommendationRequestDto } from './dto/company-recommendation-request.dto';
import { GenerateRecommendationsDto } from './dto/generate-recommendations.dto';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get('campaigns')
  async getCampaigns() {
    return this.recommendationsService.getCampaigns();
  }

  @Post('companies')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async rankCompanies(
    @Body() request: CompanyRecommendationRequestDto,
  ) {
    return this.recommendationsService.rankCompanies(request);
  }

  @Post('companies/generate')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async generateCompanyRecommendations(
    @Body() request: GenerateRecommendationsDto,
  ) {
    const scoringRequest =
      await this.recommendationsService.buildScoringRequest(
        request.campaignId,
        request.targetMarket,
        request.evaluationDate,
      );

    return this.recommendationsService.rankCompanies(scoringRequest);
  }

}
