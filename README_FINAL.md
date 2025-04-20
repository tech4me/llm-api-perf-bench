# LLM API Performance Bench
A Web Application for Benchmarking LLM API Performance

# Team Information
Shizhang Yin 1002428027 shizhang.yin@mail.utoronto.ca 

## Motivation

### Problem Identification
In today's AI landscape, organizations face a critical business challenge: selecting the optimal LLM API provider from an increasingly crowded marketplace. While many providers offer identical open-source models (DeepSeek, Llama, Mistral, etc.), they differ in:
- Pricing structures and cost efficiency
- Regional availability and performance
- Response latency and throughput 
- Consistency across different prompt types

Despite the significant financial and performance implications of these choices, users currently lack easy-to-use, objective, and personalized tools to evaluate providers based on metrics that directly impact their specific user experience and operational costs.

### Why This Project is Worth Pursuing
This project delivers substantial value by:
1. **Enabling data-driven decisions**: Replacing subjective marketing claims with actual performance metrics gathered under real-world conditions
2. **Reducing operational costs**: Helping organizations identify the most cost-effective provider for their specific usage patterns
3. **Improving user experience**: Allowing developers to select providers that optimize critical metrics like latency and reliability
4. **Providing competitive insights**: Delivering ongoing benchmarking capabilities as the LLM provider landscape evolves
5. **Democratizing performance testing**: Making sophisticated benchmarking accessible without requiring extensive technical knowledge

By addressing these needs, the tool empowers users to make informed decisions tailored to their specific use cases.

### Target Users
Our solution targets two primary user segments:

**Application Developers and Engineering Teams**
- Need to select optimal providers for production applications
- Require data on performance under specific load patterns
- Must justify provider choices with objective metrics
- Care about latency, consistency, and cost-efficiency

**Business Decision Makers**
- Require cost-performance analysis across providers
- Need clear visualization of benchmark results
- Make strategic decisions about AI infrastructure
- Often lack technical background to create custom testing tools

### Existing Solutions and Limitations
Current approaches to LLM provider evaluation fall short in addressing user needs:

**1. Third-Party Benchmark Platforms (e.g., Artificial Analysis)**
These platforms provide general benchmarks but are inadequate for specific use cases:
- **Lack of customization**: Benchmarks are not run with user-specific prompts or workloads
- **Non-representative conditions**: Tests run using the platform's API keys, potentially yielding different results than users would experience

**2. Custom In-House Testing Scripts**
While some organizations develop custom testing solutions, this approach is problematic due to:
- **High technical barrier**: Requires specialized knowledge of API interactions and performance measurement
- **Resource intensive**: Demands significant engineering time to develop and maintain
- **Inconsistent methodologies**: Each organization reinvents measurement approaches, making cross-comparison difficult
- **Limited visualization**: Often lacks intuitive dashboards for result interpretation
- **No historical trending**: Typically provides point-in-time data without tracking changes over time

Our platform bridges these gaps by providing an accessible and customizable benchmarking solution that offers the precision of custom tools with the ease-of-use of third-party platforms. The resulting tool directly addresses the limitations of existing solutions while remaining focused on the specific needs of our target users.

## Objective and Key Features

### Project Objectives
The primary objective of this project is to create a full-stack web application that enables users to benchmark the performance of LLM API providers using their own API keys. Specifically, the application aims to provide objective performance metrics for comparing LLM API providers, enable personalized benchmarking with users' own API keys and custom prompts, visualize performance data in an intuitive and actionable format, and store historical benchmark results for tracking provider improvements over time. By integrating these capabilities into a cohesive platform, users can make data-driven decisions about which LLM providers best suit their specific needs based on actual performance measurements rather than marketing claims.

### Key Features and Implementation

#### Core Features and Technical Approach
The application will be built using an Express.js backend with a React frontend to create a responsive and interactive user experience. The core benchmarking functionality will collect performance metrics from various LLM providers through their APIs, measuring crucial indicators like time to first token and tokens per second throughput. These measurements will be conducted on the client side to ensure the environment closely matches the user's production conditions. Users will be able to customize their benchmarking scenarios by specifying different prompts and model parameters to represent their actual usage patterns. The system will display benchmark results in real-time, providing immediate feedback and allowing users to make quick comparisons between providers. All benchmark results will be stored, enabling users to track performance trends over time and observe how providers improve or degrade with updates.

The Express.js backend will implement a RESTful API design with dedicated endpoints for user management, benchmark operations, and result retrieval. It will also handle user authentication and data security. For the frontend, the React application will utilize Tailwind CSS for styling and the shadcn/ui component library to create a consistent, accessible, and visually appealing interface. Chart.js will optionally be integrated for creating interactive visualizations of benchmark results.

#### Database Structure and Data Management
The application's data model revolves around four primary entities with clear relationships:

```
User (1) ---- (*) API Keys (1) ---- (*) Benchmarks (1) ---- (*) Results
```

The User entity captures authentication information including email and securely hashed passwords. Each user can manage multiple API Keys, with each key corresponding to a different LLM provider. The Benchmark entity represents a specific benchmark configuration, linked to both a user and an API key, storing details like the prompt text, output tokens, creation time, and key timing parameters measured. Finally, the Result entity captures the actual performance metrics from each benchmark run, including latency measurements, throughput statistics, and completion status.

These relationships create a well-structured data hierarchy where users own API keys, users create benchmarks, and benchmarks generate results. This design enables powerful querying capabilities, such as comparing results across different providers for the same prompt, tracking performance of a specific provider over time, or aggregating results across different prompt types. The entire database will be implemented in PostgreSQL, chosen for its reliability, support for complex queries, and robust security features. Database migrations will be managed through the Prisma ORM to ensure schema evolution without data loss.

#### Storage Requirements and External Integrations
The application's storage needs are relatively modest, focusing primarily on structured data rather than large files or media content. The PostgreSQL database will be hosted on a cloud provider like Supabase. Static assets for the frontend, including images and client-side JavaScript, will be hosted on Vercel or a similar platform optimized for web application delivery. Benchmark configurations including user custom prompts will be stored as JSON documents within the database, and all user data including API keys will reside in appropriate PostgreSQL tables.

The application will integrate with multiple external services to provide its core functionality. The primary integration will be with OpenAI-compatible LLM APIs. These integrations will handle the actual prompting and response collection for benchmarking purposes. The application may optionally integrate with OAuth providers like Google to simplify user authentication.

#### User Interface and Experience Design
Upon accessing the application, users will first encounter a login screen. After authentication, the interface will be divided into three main sections. The leftmost section will allow users to add LLM vendors and their corresponding API keys through an intuitive popup interface. The middle section will display benchmark sessions for the currently selected API vendor. The rightmost section will show the prompt and reply with its time measurements, and will also allow users to input new prompts or select from pre-defined options.

The UI will implement a consistent design language using Tailwind CSS and the shadcn/ui component library, featuring intuitive navigation and appropriate use of color to highlight important information. The application will be fully responsive, displaying live output token updates to provide users with real-time feedback during benchmarking operations.

### Fulfillment of Course Requirements
This project satisfies the course requirements in the following ways:
- **Frontend Requirement**: The project implements a React-based frontend with Tailwind CSS and component libraries to create a responsive, user-friendly interface with a responsive design.
- **Data Storage Requirement**: The project will use PostgreSQL for robust data management and storage, hosted through a cloud service provider.
- **Architecture Approach**: The project will use an Express.js server backend paired with the React frontend, with communication handled through a RESTful API.
- **Advanced Features**: The project incorporates user authentication and authorization systems, and integration with LLM services through external APIs.


# Development Guide



# Deployment Information
All component of this web application are deployed through DigitalOcean.

## Frontend:

## Backend:

## Database:

# Individual Contributions
This is a solo project so all coding, testing, deployment are done by myself.

# Lessons Learned and Concluding Remarks

### Gap between local development and deployment


### The value of having good example in a library


## Conlusion
Background in C++ and lower level language.
