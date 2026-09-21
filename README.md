# Project Structure

postgres-modernization-lab/

frontend/
    src/
        App.css
        App.tsx
        index.css
        main.tsx
        assets
    eslint.config.js
    package-lock.json
    tsconfig.app.json
    package.json
    tsconfig.json
    tsconfig.node.json
    vite.config.ts
    index.html
    public

backend/
    src/
        app.controller.spec.ts
        app.module.ts
        app.controller.ts
        app.service.ts
        main.ts
        crm
            crm.controller.spec.ts
            crm.module.ts
            crm.service.ts
            crm.controller.ts
            crm.service.spec.ts
            entities
                company.entity.ts

sql/
   practice.sql
   crm.sql

# Database Architecture

## PostgreSQL
    Database Name:
    sql_playground

--

## Schema: crm

### companies
Stores company/client records used by the CRM frontend

Key Fields:
- id
- company_name
- office_location
- industry

--

### contacts
Stores company contact information

Key Fields:
- contact_id
- company_id
- contact_name
- email

--

### campaigns
Stores outreach or marketing campaign data

Key Fields:
- campaign_id                   PRIMARY KEY
- campaign_name                 
- target_market
- campaign_description
- start_date
- end_date

--

### outreach_events
Stores communication history and engagement tracking

Key Fields:
- outreach_event_id (PK) 
- company_id (FK)
- contact_id (FK)
- campaign_id (FK)
- outreach_type
- outreach_status
- outreach_date
- follow_up_date
- notes

# System Flow

React Frontend
    ↓
NestJS REST API
    ↓
PostgreSQL Database

# Technologies

Frontend:
- React
- TypeScript
- Vite

Backend:
- NestJS
- Node.js
- TypeORM

Database:
- PostgreSQL

Infrastructure:
- AWS EC2
- Nginx
- Docker (planned)