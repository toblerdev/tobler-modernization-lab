--
-- PostgreSQL database dump
--

\restrict 9rmGl63giI93bcGBv6c9WEUNhKi7VeVg6uNw1BhzozddQP6bKeRl8yXQbDDe4j8

-- Dumped from database version 14.20 (Homebrew)
-- Dumped by pg_dump version 14.20 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: crm; Owner: -
--

INSERT INTO crm.campaigns (campaign_id, campaign_name, target_market, campaign_description, start_date, end_date, created_at) VALUES (1, 'Initial Outreach Campaign - Batch 1', 'Machine Tools / CNC', 'Taichung machine tool outreach batch', '2026-05-14', NULL, '2026-05-14 14:29:12.96792');
INSERT INTO crm.campaigns (campaign_id, campaign_name, target_market, campaign_description, start_date, end_date, created_at) VALUES (2, 'Initial Outreach Campaign - Batch 2', 'Machine Tools / CNC', 'Taichung machine tool outreach batch', '2026-05-14', NULL, '2026-05-14 14:29:12.96792');
INSERT INTO crm.campaigns (campaign_id, campaign_name, target_market, campaign_description, start_date, end_date, created_at) VALUES (3, 'Taiwan Bicycle Tradeshow Outreach', 'Bicycle / E-Bike', 'Taichung Bicycle Industry', NULL, NULL, '2026-11-08 15:19:22.480781');
INSERT INTO crm.campaigns (campaign_id, campaign_name, target_market, campaign_description, start_date, end_date, created_at) VALUES (4, 'Taiwan automation tradeshow outreach', 'Automation / Robotics', 'Taiwan automation trade show', NULL, NULL, '2026-11-08 15:27:14.392979');


--
-- Data for Name: recommendation_rules; Type: TABLE DATA; Schema: crm; Owner: -
--

INSERT INTO crm.recommendation_rules (rule_id, rule_code, description, default_weight, enabled, created_at, updated_at) OVERRIDING SYSTEM VALUE VALUES (1, 'TARGET_MARKET_MATCH', 'Company matches campaign target market', 25, true, '2026-10-26 10:22:53.698845', '2026-10-26 10:22:53.698845');
INSERT INTO crm.recommendation_rules (rule_id, rule_code, description, default_weight, enabled, created_at, updated_at) OVERRIDING SYSTEM VALUE VALUES (2, 'CONTACT_AVAILABLE', 'Company has usable contact information', 15, true, '2026-10-26 10:22:53.698845', '2026-10-26 10:22:53.698845');
INSERT INTO crm.recommendation_rules (rule_id, rule_code, description, default_weight, enabled, created_at, updated_at) OVERRIDING SYSTEM VALUE VALUES (3, 'NEVER_CONTACTED', 'Company has no previous outreach', 20, true, '2026-10-26 10:22:53.698845', '2026-10-26 10:22:53.698845');
INSERT INTO crm.recommendation_rules (rule_id, rule_code, description, default_weight, enabled, created_at, updated_at) OVERRIDING SYSTEM VALUE VALUES (4, 'FOLLOWUP_OVERDUE', 'Company has an overdue follow-up', 25, true, '2026-10-26 10:22:53.698845', '2026-10-26 10:22:53.698845');
INSERT INTO crm.recommendation_rules (rule_id, rule_code, description, default_weight, enabled, created_at, updated_at) OVERRIDING SYSTEM VALUE VALUES (5, 'FOLLOWUP_DUE_TODAY', 'Company has a follow-up due today', 15, true, '2026-10-26 10:22:53.698845', '2026-10-26 10:22:53.698845');


--
-- Data for Name: campaign_rule_overrides; Type: TABLE DATA; Schema: crm; Owner: -
--

INSERT INTO crm.campaign_rule_overrides (override_id, campaign_id, rule_id, weight_override, enabled_override, created_at, updated_at) OVERRIDING SYSTEM VALUE VALUES (2, 1, 1, 40, NULL, '2026-11-03 11:31:27.341049', '2026-11-03 11:31:27.341049');


--
-- Data for Name: companies; Type: TABLE DATA; Schema: crm; Owner: -
--

INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (4, 'George Machine Tools LTD Chyun Yow Machinery Industry Co. Ltd', 'Taichung City', 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (5, 'Jiuh Yeh Precision Machinery CO. Ltd', 'Taichung City', 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (6, 'Victor Taichung Machinery Works', 'Taichung City', 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (7, 'Tongtai Machine & Tool', 'Kaohsiung City', 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (8, 'Fair Friend Group (FFG)', 'Taipei City', 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (9, 'You Ji Machine Industrial', 'Kaohsiung City', 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (10, 'Campro Precision Machinery', 'Taichung City', 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (11, 'Hartford Machinery (SHE HONG INDUSTRIAL CO. LTD.)', 'Taichung City', 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (12, 'YCM (Yeong Chin Machinery)', 'Taichung City', 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (13, 'Kao Ming Machinery', 'Taichung City', 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (15, 'Akira Seiki', NULL, 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (16, 'Leadwell CNC Machines', NULL, 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (17, 'Vision Wide Tech', NULL, 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (18, 'Quaser Machine Tools', NULL, 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (19, 'Buffalo Machinery', NULL, 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (20, 'Kent Industrial', NULL, 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (21, 'Chmer EDM', NULL, 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (22, 'Excetek Technologies', NULL, 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (23, 'AWEA Mechatronic', NULL, 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (24, 'Takisawa Taiwan', NULL, 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (25, 'Goodway Machine Corp', NULL, 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (26, 'HIWIN Technologies', NULL, 'Automation / Robotics', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (27, 'Delta Electronics', NULL, 'Automation / Robotics', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (28, 'Techman Robot', NULL, 'Automation / Robotics', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (29, 'AIRTAC', NULL, 'Automation / Robotics', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (30, 'CPC Corporation', NULL, 'Automation / Robotics', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (31, 'Syntec Technology', NULL, 'Automation / Robotics', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (32, 'PMI Group', NULL, 'Automation / Robotics', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (33, 'TBI Motion', NULL, 'Automation / Robotics', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (34, 'Fatek Automation', NULL, 'Automation / Robotics', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (35, 'APLEX Technology', NULL, 'Automation / Robotics', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (36, 'Adlink Technology', NULL, 'Automation / Robotics', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (37, 'Intelligent Machines Inc.', NULL, 'Automation / Robotics', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (38, 'Advantech', NULL, 'Industrial Computing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (39, 'Axiomtek', NULL, 'Industrial Computing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (40, 'IEI Integration', NULL, 'Industrial Computing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (41, 'Winmate', NULL, 'Industrial Computing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (42, 'DFI', NULL, 'Industrial Computing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (43, 'Avalue Technology', NULL, 'Industrial Computing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (44, 'ASRock Industrial', NULL, 'Industrial Computing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (45, 'ICP DAS', NULL, 'Industrial Computing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (46, 'Giant Manufacturing', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (47, 'Merida Industry', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (48, 'KMC Chain Industrial', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (49, 'VP Components', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (50, 'Wellgo Pedals', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (51, 'Pacific Cycles', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (52, 'TranzX (JD Components)', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (53, 'Kind Shock', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (54, 'SR Suntour', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (55, 'Velo Saddles', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (56, 'Kalloy', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (57, 'HL Corp (Zoom)', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (58, 'Topeak', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (59, 'Maxxis (Cheng Shin)', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (60, 'Kenda Rubber', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (61, 'Chaoyang Tire', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (62, 'Tern Bicycles Taiwan Operations', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (63, 'A-Pro Tech', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (64, 'Joy Industrial', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (65, 'Exustar Enterprise', NULL, 'Bicycle / E-Bike', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (66, 'Chun Yu Works', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (67, 'Boltun Corporation', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (68, 'San Shing Fastech', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (69, 'Zyh Yin Enterprise', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (70, 'Yoke Industrial', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (71, 'Ta Chen Stainless Pipe', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (72, 'Taiwan Hodaka Technology', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (73, 'Chain We Machinery', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (74, 'Golden Sun Industrial', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (75, 'EAS Change Systems', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (76, 'Vector Machinery Works', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (77, 'Hota Industrial', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (78, 'Habor Precision', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (79, 'Main Drive Corporation', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (80, 'Feng Ching Metal', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (81, 'Jainnher Machine', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (82, 'Everising Machine', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (83, 'Posa Machinery', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (84, 'Li Ming Machinery', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (85, 'Earth-Chain Enterprise', NULL, 'Precision Manufacturing', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (86, 'Gigabyte Technology', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (87, 'MSI (Micro-Star International)', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (88, 'Acer Manufacturing / Operations Teams', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (89, 'Lite-On Technology', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (90, 'Pegatron Taiwan Operations', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (91, 'Wistron Taiwan Operations', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (92, 'Quanta Computer Taiwan Operations', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (93, 'Innodisk', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (94, 'VIA Labs', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (95, 'Shuttle Inc.', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (3, 'Jeenxi Technology. Ltd (Sunmill CNC Machine Tools)', 'Taichung City', 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (96, 'ASUS Industrial Teams', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (97, 'iBASE Technology', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (98, 'Portwell', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (99, 'NEXCOM', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (100, 'Darveen', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (101, 'Cincoze', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (102, 'Vecow', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (103, 'Arbor Technology', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (104, 'Premio Inc.', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (105, 'Jetway Information', NULL, 'Electronics / Embedded', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (1, 'SOCO Machinery HQ', 'Taichung City', 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (2, 'Jainnher Machine Co. LTD', 'Taichung City', 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');
INSERT INTO crm.companies (company_id, company_name, office_location, target_group, created_at) VALUES (14, 'Pinnacle Machine Tool', 'Changhua City', 'Machine Tools / CNC', '2026-05-13 18:05:46.748657');


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: crm; Owner: -
--

INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (2, 3, 'Mr. Test', NULL, 'test@test.com.tw', NULL, NULL, '2026-05-14 13:08:44.772109');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (6, 12, 'Mr. Test', NULL, 'test@test.com.tw', NULL, NULL, '2026-05-14 13:08:44.772109');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (10, 11, 'Mr. Test', NULL, 'test@test.com.tw', NULL, NULL, '2026-05-14 13:09:57.809175');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (12, 2, 'Mr. Test', NULL, 'test@test.com.tw', NULL, NULL, '2026-05-21 22:04:48.468095');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (13, 3, 'Mr. Test', NULL, 'test@test.com.tw', NULL, NULL, '2026-05-21 22:07:14.550131');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (14, 1, 'Mr. Test', NULL, 'test@test.com.tw', NULL, '111-111-1111', '2026-09-15 21:09:35.610179');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (16, 2, 'Mr. Test', NULL, 'test@test.com.tw', NULL, '111-111-2111', '2026-09-16 15:37:41.219953');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (18, 1, 'Mr. Test', 'Test dude 1', 'test@test.com.tw', NULL, '111-111-1111', '2026-09-18 15:00:53.609289');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (15, 1, 'Mr. Test', 'Sales', 'test@test.com.tw', NULL, '111-111-1112', '2026-09-15 21:19:09.141104');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (11, 1, 'Mr. Test', 'Developer', 'test@test.com.tw', NULL, '222-222-2222', '2026-05-21 22:01:21.7239');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (7, 1, 'Mr. Test', 'Branding Manager', 'test@test.com.tw', NULL, NULL, '2026-05-14 13:09:57.809175');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (1, 1, 'Mr. Test', 'Senior Sales', 'test@test.com.tw', NULL, NULL, '2026-05-14 13:08:44.772109');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (20, 5, 'Mr. Test', 'Sales', 'test@test.com.tw', NULL, '111-122-2333', '2026-10-02 10:37:17.5752');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (21, 1, 'Mr. Test', 'HR', 'test@test.com.tw', NULL, '1112220934', '2026-10-18 11:06:49.924084');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (22, 14, 'Mr. Test', 'Employee One', 'test@test.com.tw', NULL, '111-222-3333', '2026-10-18 11:30:22.414975');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (23, 14, 'Mr. Test', 'Employee Two', 'test@test.com.tw', NULL, '111-222-3333', '2026-10-18 11:52:33.051717');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (24, 14, 'Mr. Test', 'Employee Three Test', 'test@test.com.tw', NULL, '111-222-3333', '2026-10-18 18:35:22.984306');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (25, 4, 'Mr. Test', 'HR', 'test@test.com.tw', NULL, '1112223333', '2026-10-23 17:02:53.421001');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (3, 6, 'Mr. Test', 'Sales Manager', 'test@test.com.tw', NULL, NULL, '2026-05-14 13:08:44.772109');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (8, 6, 'Mr. Test', 'Overseas Marketing Manager', 'test@test.com.tw', NULL, NULL, '2026-05-14 13:09:57.809175');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (4, 10, 'Mr. Test', 'Sales Assistant Manager', 'test@test.com.tw', NULL, NULL, '2026-05-14 13:08:44.772109');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (9, 10, 'Mr. Test', 'General Manager', 'test@test.com.tw', NULL, NULL, '2026-05-14 13:09:57.809175');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (5, 11, 'Mr. Test', 'Sales Specialist', 'test@test.com.tw', NULL, NULL, '2026-05-14 13:08:44.772109');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (26, 46, 'Test Person One', 'Sales', 'tpersonone@test.com.tw', NULL, '1111-111-111', '2026-11-08 18:48:50.198687');
INSERT INTO crm.contacts (contact_id, company_id, contact_name, role_title, email, linkedin_url, phone_number, created_at) VALUES (27, 57, 'Test Person Zoomone', 'Sale Manager', 'tpzoomone@test.com.tw', NULL, '1111-111-111', '2026-11-08 18:50:05.819624');


--
-- Data for Name: outreach_events; Type: TABLE DATA; Schema: crm; Owner: -
--

INSERT INTO crm.outreach_events (outreach_event_id, company_id, contact_id, campaign_id, outreach_type, outreach_status, outreach_date, follow_up_date, notes, created_at) VALUES (1, 4, NULL, NULL, 'Email', 'Initial Email Sent', '2026-05-12', NULL, 'Imported from practice.client_targets', '2026-05-14 14:33:52.45583');
INSERT INTO crm.outreach_events (outreach_event_id, company_id, contact_id, campaign_id, outreach_type, outreach_status, outreach_date, follow_up_date, notes, created_at) VALUES (2, 5, NULL, NULL, 'Email', 'Initial Email Sent', '2026-05-12', NULL, 'Imported from practice.client_targets', '2026-05-14 14:33:52.45583');
INSERT INTO crm.outreach_events (outreach_event_id, company_id, contact_id, campaign_id, outreach_type, outreach_status, outreach_date, follow_up_date, notes, created_at) VALUES (3, 2, NULL, NULL, 'Email', 'Initial Email Sent', '2026-05-12', NULL, 'Imported from practice.client_targets', '2026-05-14 14:33:52.45583');


--
-- Name: campaign_rule_overrides_override_id_seq; Type: SEQUENCE SET; Schema: crm; Owner: -
--

ALTER SEQUENCE crm.campaign_rule_overrides_override_id_seq RESTART WITH 3;


--
-- Name: campaigns_campaign_id_seq; Type: SEQUENCE SET; Schema: crm; Owner: -
--

ALTER SEQUENCE crm.campaigns_campaign_id_seq RESTART WITH 5;


--
-- Name: companies_company_id_seq; Type: SEQUENCE SET; Schema: crm; Owner: -
--

ALTER SEQUENCE crm.companies_company_id_seq RESTART WITH 122;


--
-- Name: contacts_contact_id_seq; Type: SEQUENCE SET; Schema: crm; Owner: -
--

ALTER SEQUENCE crm.contacts_contact_id_seq RESTART WITH 28;


--
-- Name: outreach_events_outreach_event_id_seq; Type: SEQUENCE SET; Schema: crm; Owner: -
--

ALTER SEQUENCE crm.outreach_events_outreach_event_id_seq RESTART WITH 4;


--
-- Name: recommendation_rules_rule_id_seq; Type: SEQUENCE SET; Schema: crm; Owner: -
--

ALTER SEQUENCE crm.recommendation_rules_rule_id_seq RESTART WITH 6;


--
-- PostgreSQL database dump complete
--

\unrestrict 9rmGl63giI93bcGBv6c9WEUNhKi7VeVg6uNw1BhzozddQP6bKeRl8yXQbDDe4j8

