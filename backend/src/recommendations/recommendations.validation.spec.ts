
import { Test } from '@nestjs/testing';
import { INestApplication, HttpServer } from '@nestjs/common';
import request from 'supertest';

import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';

describe('Recommendations HTTP validation', () => {
  let app: INestApplication;

  const rankCompanies = jest.fn();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RecommendationsController],
      providers: [
        {
          provide: RecommendationsService,
          useValue: { rankCompanies },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    rankCompanies.mockReset();
  });

  // Test 1: Invalid request should return HTTP 400
  it('rejects an invalid rule weight without calling the service', async () => {
    const invalidRequest = {
      campaignId: 1,
      targetMarket: 'Machine Tools/CNC',
      evaluationDate: '2026-10-30',
      rules: [
        {
          code: 'TARGET_MARKET_MATCH',
          weight: 'twenty-five',
          enabled: true,
        },
      ],
      companies: [],
    };

    await request(app.getHttpServer() as HttpServer)
      .post('/recommendations/companies')
      .send(invalidRequest)
      .expect(400);

    expect(rankCompanies).not.toHaveBeenCalled();
  });

  // Test 2: Valid request should reach the service
  it('accepts a valid request and forwards it to the service', async () => {
    const validRequest = {
      campaignId: 1,
      targetMarket: 'Machine Tools/CNC',
      evaluationDate: '2026-10-30',
      rules: [
        {
          code: 'TARGET_MARKET_MATCH',
          weight: 25,
          enabled: true,
        },
      ],
      companies: [
        {
          companyId: 101,
          companyName: 'ABC Manufacturing',
          targetGroup: 'Machine Tools/CNC',
          hasUsableContact: true,
          hasOutreachHistory: false,
          nextFollowUpDate: null,
        },
      ],
    };

    const expectedResponse = {
      campaignId: 1,
      recommendations: [
        {
          companyId: 101,
          companyName: 'ABC Manufacturing',
          score: 25,
          reasons: ['TARGET_MARKET_MATCH'],
        },
      ],
    };

    rankCompanies.mockResolvedValue(expectedResponse);

    await request(app.getHttpServer() as HttpServer)
      .post('/recommendations/companies')
      .send(validRequest)
      .expect(201)
      .expect(expectedResponse);

    expect(rankCompanies).toHaveBeenCalledTimes(1);
    expect(rankCompanies).toHaveBeenCalledWith(validRequest);
  });
});
