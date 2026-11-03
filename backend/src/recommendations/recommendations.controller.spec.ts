
import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';

describe('RecommendationsController', () => {
  let controller: RecommendationsController;

  const mockRecommendationsService = {
    rankCompanies: jest.fn(),
    buildScoringRequest: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendationsController],
      providers: [
        {
          provide: RecommendationsService,
          useValue: mockRecommendationsService,
        },
      ],
    }).compile();

    controller = module.get<RecommendationsController>(
      RecommendationsController,
    );
  });

  it('should forward company recommendations to the service', async () => {
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

    mockRecommendationsService.rankCompanies.mockResolvedValue(response);

    const result = await controller.rankCompanies(request);

    expect(mockRecommendationsService.rankCompanies)
      .toHaveBeenCalledWith(request);

    expect(result).toEqual(response);
  });


  it('should generate recommendations using database data', async () => {
    const request = {
      campaignId: 1,
      targetMarket: 'Manufacturing',
      evaluationDate: '2026-11-02',
    };

    const scoringRequest = {
      ...request,
      rules: [],
      companies: [],
    };

    const response = {
      campaignId: 1,
      recommendations: [],
    };

    jest
      .spyOn(mockRecommendationsService, 'buildScoringRequest')
      .mockResolvedValueOnce(scoringRequest);

    jest
      .spyOn(mockRecommendationsService, 'rankCompanies')
      .mockResolvedValueOnce(response);

    const result =
      await controller.generateCompanyRecommendations(request);

    expect(mockRecommendationsService.buildScoringRequest).toHaveBeenCalledWith(
      1,
      'Manufacturing',
      '2026-11-02',
    );

    expect(mockRecommendationsService.rankCompanies).toHaveBeenCalledWith(
      scoringRequest,
    );

    expect(result).toEqual(response);
  });

});
