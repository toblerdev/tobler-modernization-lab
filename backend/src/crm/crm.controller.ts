import { Body, Controller, Get, Post, Delete, Param, Patch} from '@nestjs/common';
import { CrmService } from './crm.service';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('companies')
  getCompanies(): Promise<Company[]> {
    return this.crmService.findAllCompanies();
  }

  @Post('companies')
  createCompany(@Body() createCompanyDto: CreateCompanyDto){
    return this.crmService.createCompany(createCompanyDto);
  }

  @Delete('companies/:id')
  deleteCompany(@Param('id') id: string) {
    return this.crmService.deleteCompany(Number(id));
  }

  @Patch('companies/:id')
  updateCompany(
    @Param('id') id: string,
    @Body()updateData: {
      companyName?: string;
      officeLocation?: string;
      industry?: string;
    },
  ) 
  
  {
    return this.crmService.updateCompany(Number(id), updateData);
  }
}