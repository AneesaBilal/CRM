# NexaCRM — Customer Relationship Management System

NexaCRM is a modern, production-style CRM system built to help businesses manage leads, contacts, companies, conversations, sales data, and daily operations from one centralized platform.

## Features

* Secure Supabase authentication
* Admin dashboard
* CRM metrics and business overview
* Lead management
* Contact management
* Company management
* Inbox and conversations
* Supabase-backed messaging
* Search and filtering
* Add and delete CRM records
* Recent leads overview
* Sales pipeline tracking
* Task management
* Activities
* Calendar
* Products
* Quotes
* Responsive SaaS dashboard
* Dark mode interface
* PostgreSQL database
* Supabase integration

## Screenshots

### Dashboard

![Dashboard](./Screenshots/Screenshot%20%28541%29.png)

The dashboard provides a centralized overview of CRM activity and business performance.

Dashboard Metrics
Won Revenue: $98,000
Open Pipeline: $140,000
Open Deals: 2
New Leads: 1
Companies: 4
Open Tasks: 4
Recent Leads

The dashboard displays recent leads with their:

Name
Company
Status
Lead score
Deal value

### Inbox

![Inbox](./Screenshots/Screenshot%20%28542%29.png)

NexaCRM includes an integrated CRM inbox backed by Supabase.

The inbox supports:

Conversation listing
Contact-based conversations
Message history
Active conversation view
Reply composer
Sending messages
Persistent conversation storage

Supabase tables:

nexacrm_conversations
nexacrm_messages

### Leads Management

![Leads Management](./Screenshots/Screenshot%20%28543%29.png)

The Leads module manages prospective customers and sales opportunities.

Lead Information

Each lead can contain:

Name
Company
Email
Source
Status
Lead Score
Estimated Value
Lead Search

Search leads by:

Name
Company
Email
Status
Source

### Contacts

![Contacts](./Screenshots/Screenshot%20%28544%29.png)

The Contacts module stores and manages customer and business contact information.

Contact Information
Name
Job title
Company
Email
Phone
Status

### Companies

![Companies](./Screenshots/Screenshot%20%28545%29.png)

The Companies module manages business accounts and organizations.

Company Information
Company name
Domain
Industry
Location
Company size
Status


## Technology Stack

React, Vite, TypeScript, Tailwind CSS, React Router DOM, Supabase, PostgreSQL, Supabase Auth, Supabase Row Level Security, TanStack Query, React Hook Form, Zod, Zustand, Recharts, Lucide React

## Database

NexaCRM uses project-specific Supabase PostgreSQL tables:

```text
nexacrm_leads
nexacrm_contacts
nexacrm_companies
nexacrm_conversations
nexacrm_messages
```

Additional CRM modules can use:

```text
nexacrm_deals
nexacrm_pipeline_stages
nexacrm_activities
nexacrm_tasks
nexacrm_products
nexacrm_quotes
nexacrm_tickets
nexacrm_notifications
nexacrm_audit_logs
```

## Authentication

Authentication is handled through Supabase Auth.

The application includes:

* Email/password login
* Protected routes
* Authenticated dashboard
* User session management
* Sign out functionality

Example development account:

```text
Email: admin@nexacrm.test
```

Do not use real credentials in source code or commit them to GitHub.

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Never expose or commit the Supabase service-role key to the frontend.

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate into the project:

```bash
cd NexaCRM
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```text
.env
```

Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```
## CRM Workflow

```text
Lead
  ↓
Qualification
  ↓
Contact / Company
  ↓
Deal
  ↓
Sales Pipeline
  ↓
Activities & Tasks
  ↓
Quote
  ↓
Won Deal
  ↓
Revenue Tracking
```

## UI Highlights

* Professional dark sidebar
* Clean SaaS dashboard
* Data-driven metric cards
* Responsive tables
* Search interfaces
* Status badges
* CRM action buttons
* Conversation interface
* Professional form layouts
* Supabase-backed data
* Consistent spacing and typography

## Security

NexaCRM is designed with security in mind.

Security features include:

* Supabase authentication
* Protected routes
* PostgreSQL database
* Row Level Security
* Environment-based configuration
* Role-based access architecture
* No service-role credentials in frontend code

## Future Enhancements

* Drag-and-drop sales pipeline
* Advanced deal management
* Sales forecasting
* Detailed analytics
* CSV import/export
* Bulk actions
* Email integrations
* Calendar integrations
* Customer support ticketing
* Team performance reports
* Advanced role permissions
* Audit logs
* Dashboard customization
* Automated notifications

## License

This project is intended for educational, portfolio, and development purposes.



