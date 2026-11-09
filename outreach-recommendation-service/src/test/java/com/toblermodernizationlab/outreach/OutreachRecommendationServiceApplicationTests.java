package com.toblermodernizationlab.outreach;

import com.toblermodernizationlab.outreach.service.OutreachAiService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class OutreachRecommendationServiceApplicationTests {

	@MockitoBean
	private OutreachAiService outreachAiService;

	@Test
	void contextLoads() {
	}

}
