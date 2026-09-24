# Tobler Modernization Lab

Tobler Modernization Lab (TML) is a full-stack application and cloud deployment project designed to demonstrate the modernization of traditional enterprise application concepts using a modern TypeScript-based technology stack.

The project combines a React frontend, NestJS REST API, PostgreSQL relational database, and AWS infrastructure. It serves as a hands-on environment for developing and demonstrating skills in backend modernization, cloud deployment, database design, API development, security, automation, and operational reliability.

## Architecture

```text
                         Cloudflare
                             │
                        HTTPS / DNS
                             │
                             ▼
                      AWS Elastic IP
                             │
                             ▼
                           Nginx
                         /       \
                        ▼         ▼
                React / Vite    NestJS API
                                    │
                                    ▼
                                TypeORM
                                    │
                                    ▼
                               PostgreSQL
                                    │
                              Daily pg_dump
                                    │
                                    ▼
                                Amazon S3
```

## Application

TML currently contains a CRM-style application used to manage companies, contacts, marketing campaigns, and outreach activity.

### Companies

Stores organizations used by the CRM.

Key data includes:

- Company ID
- Company name
- Office location
- Industry / target group

### Contacts

Stores contacts associated with companies.

Key data includes:

- Contact ID
- Company ID
- Contact name
- Email
- Phone
- Role

### Campaigns

Stores outreach and marketing campaign information.

Key data includes:

- Campaign ID
- Campaign name
- Target market
- Campaign description
- Start date
- End date

### Outreach Events

Stores communication history and engagement activity.

Key data includes:

- Outreach event ID
- Company ID
- Contact ID
- Campaign ID
- Outreach type
- Outreach status
- Outreach date
- Follow-up date
- Notes

## System Flow

```text
React Frontend
      │
      ▼
NestJS REST API
      │
      ▼
TypeORM
      │
      ▼
PostgreSQL
```

The frontend communicates with the NestJS backend through REST endpoints. NestJS uses TypeORM for persistence and database interaction.

## Database Architecture

### PostgreSQL

Production database:

`modernization_lab`

Application database user:

`tml_app`

Primary application schema:

`crm`

Current CRM tables:

- `companies`
- `contacts`
- `campaigns`
- `outreach_events`

Foreign-key relationships connect contacts and outreach activity to their associated CRM records.

## AWS Deployment

TML is deployed on an Amazon Linux EC2 instance.

The deployment currently includes:

- AWS EC2 application hosting
- PostgreSQL running on EC2
- Elastic IP for a persistent public address
- Nginx web server and reverse proxy
- Cloudflare DNS and proxy
- HTTPS access through the public TML domain
- Amazon S3 off-instance database backups
- IAM role-based AWS authentication

Production site:

`https://toblermodernizationlab.com`

## Database Backup and Recovery

TML includes an automated PostgreSQL backup and recovery strategy.

The backup process uses:

1. `pg_dump` to create compressed PostgreSQL backups.
2. Timestamped backup files stored in a protected EC2 directory.
3. A systemd timer to execute backups automatically each day.
4. Amazon S3 for off-instance backup storage.
5. An EC2 IAM role for S3 authentication instead of stored AWS access keys.
6. An S3 lifecycle policy to expire backups after 30 days.

Backup recovery has been tested by restoring a production backup into an isolated PostgreSQL test database and verifying the CRM schema and tables before removing the temporary database.

## Security and Reliability

Current infrastructure practices include:

- HTTPS
- Cloudflare proxying
- Persistent AWS Elastic IP
- Private S3 backup storage
- IAM role-based AWS access
- Least-privilege S3 permissions
- Restricted local backup directory permissions
- Automated database backups
- Backup retention policy
- Tested PostgreSQL recovery procedure

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Node.js
- NestJS
- TypeScript
- TypeORM
- REST APIs

### Database

- PostgreSQL
- SQL

### AWS / Infrastructure

- Amazon EC2
- Amazon S3
- AWS IAM
- Elastic IP
- Amazon Linux
- Nginx
- systemd
- Cloudflare
- HTTPS

### Development and Operations

- Git
- GitHub
- npm
- Postman
- VS Code
- Jira / Kanban

## Project Structure

```text
postgres-modernization-lab/
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── assets/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── crm/
│   │       ├── entities/
│   │       └── contact/
│   └── package.json
│
└── sql/
    ├── practice.sql
    └── crm.sql
```

## Modernization Objectives

TML is intended to demonstrate practical skills involved in moving enterprise application concepts toward modern architectures.

Areas being developed through the project include:

- TypeScript backend development
- REST API design
- Relational database design
- ORM-based persistence
- Full-stack application development
- Linux server administration
- AWS cloud infrastructure
- Application deployment
- Infrastructure security
- Backup and disaster recovery
- Deployment automation
- Automated testing
- CI/CD

## Roadmap

Planned work includes:

- CI/CD pipeline
- Expanded automated testing
- Deployment automation
- Containerization
- AI-assisted CRM capabilities
- AI-generated personalized outreach
- Additional monitoring and operational improvements

## Project Status

TML is under active development.

The application is currently deployed to AWS and accessible through its public HTTPS domain. Current development is focused on improving deployment automation, testing, reliability, and intelligent CRM functionality.