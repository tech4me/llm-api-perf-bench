# LLM API Performance Bench
A Web Application for Benchmarking LLM API Performance

# Team Information
Shizhang Yin | 1002428027 | shizhang.yin@mail.utoronto.ca

This project was completed as an individual effort. Feel free to contact me at the email address above for any clarifications or questions about the implementation.

# Motivation

## Problem Identification
In today's AI landscape, organizations face a critical business challenge: selecting the optimal LLM API provider from an increasingly crowded marketplace. While many providers offer identical open-source models (DeepSeek, Llama, Mistral, etc.), they differ significantly in:

- Pricing structures and cost efficiency
- Regional availability and performance
- Response latency and throughput 
- Consistency across different prompt types

Despite the significant financial and performance implications of these choices, users currently lack easy-to-use, objective, and personalized tools to evaluate providers based on metrics that directly impact their specific user experiences and operational costs.

## Value Proposition
This project delivers substantial value by:

1. **Enabling data-driven decisions**: Replacing subjective marketing claims with actual performance metrics gathered under real-world conditions
2. **Reducing operational costs**: Helping organizations identify the most cost-effective provider for their specific usage patterns
3. **Improving user experience**: Allowing developers to select providers that optimize critical metrics like latency and reliability
4. **Providing competitive insights**: Delivering ongoing benchmarking capabilities as the LLM provider landscape evolves
5. **Democratizing performance testing**: Making sophisticated benchmarking accessible without requiring extensive technical knowledge

By addressing these needs, the tool empowers users to make informed decisions tailored to their specific use cases. Our platform bridges these gaps by providing an accessible and customizable benchmarking solution that offers the precision of custom tools with the ease of use of third-party platforms.

# Objectives

## Project Goals
The primary objective of this project is to create a full-stack web application that enables users to benchmark the performance of various LLM API providers using their own API keys. Specifically, the application aims to:

1. Provide objective performance metrics for comparing LLM API providers
2. Enable personalized benchmarking with users' own API keys and custom prompts
3. Visualize performance data in an intuitive and actionable format
4. Store historical benchmark results for tracking provider changes over time
5. Create a secure environment where users can safely manage their API keys

By integrating these capabilities into a cohesive platform, users can make data-driven decisions about which LLM providers best suit their specific needs based on actual performance measurements rather than marketing claims.

# Technical Stack

## Architecture Overview
This project implements the Express.js Backend approach with a React frontend, providing a clean separation of concerns while maintaining excellent performance characteristics.

## Frontend
- **React**: Core library for building the user interface components
- **shadcn UI**: Component library providing pre-styled elements
- **Tailwind CSS**: Utility-first CSS framework for efficient styling
- **Vite**: Build tool leveraging Hot Module Replacement for rapid development

## Backend
- **Express.js**: Lightweight, flexible Node.js web application framework
- **Prisma**: Next-generation ORM for type-safe database access
- **PostgreSQL**: Robust, open-source relational database system
- **Better Auth**: Authentication and authorization middleware for secure user management

## Development Tools
- **Git**: Version control system for collaborative development
- **npm**: Package manager for JavaScript dependencies

# Features

## User Authentication
The application supports email-password based authentication using Better Auth. Key capabilities include:
- Secure user registration and login
- Persistent user sessions
- Password reset functionality
- Cross-subdomain cookie management for seamless experiences

This authentication system enables personalized measurements while securely recording past results on a per-user basis.

## API Key Management
Users can securely store and manage their LLM API provider credentials:
- Add multiple API vendors with different models
- Store API keys securely in the database
- Edit or remove API keys as needed
- Group results by vendor for easy comparison

This feature enables users to compare performance across multiple vendors without repeatedly entering credentials.

## LLM API Performance Measurement
The application measures key performance metrics directly from the client side:
- Time to first token (TTFT): Measures initial response latency
- Tokens per second (TPS): Measures throughput performance
- Total completion time: Measures end-to-end performance
- Cost estimation: Calculates approximate costs based on token counts

This implementation meets the course requirement for client-side API interaction while providing accurate timing measurements by minimizing network latency effects.

## Dynamic Streaming Response Visualization
The application leverages the streaming capabilities of LLM APIs:
- Real-time token delivery visualization
- Progressive rendering of responses as they arrive
- Visual indication of response speed variations
- Responsive UI that updates as new tokens arrive

This feature enhances the user experience by providing immediate feedback and making the application more interactive.

## Historical Performance Analysis
The system maintains a comprehensive history of benchmark results:
- Persistent storage of all measurement results
- Statistical aggregation of results by model and vendor
- Time-series analysis to identify performance trends
- Exportable results for external analysis

This feature allows users to track performance changes over time and identify optimal periods for specific workloads.

## Export Measurement Data
Measurement data can be exported to a CSV file:
- Enable custom data analysis
- Provide a comprehensive data dump

This feature allows users to save critical measurement results for further analysis and share them with others to build a case before committing to a particular API vendor.

# User Guide

## User Authentication
![Authentication Screen](images/login.png)

When a new user visits the site, they are automatically redirected to the sign-in page. The authentication flow works as follows:

1. **Sign Up**: New users can click the "Sign Up" button to access the registration page
   - Required information: username, email address, and password
   - All fields must be valid (proper email format, minimum password length)
   - Upon successful registration, users are automatically logged in

2. **Sign In**: Returning users can enter their credentials on the sign-in page
   - Required information: email address, and password
   - After successful authentication, users are redirected to the main application

## LLM API Vendor Management
![Vendor Management](images/vendor.png)

From the main dashboard, users can manage their LLM API vendors:

1. **Adding a Vendor**: Click the "Add Vendor" button to open the configuration modal
   - Enter vendor name (e.g., "OpenAI", "Anthropic", "Groq")
   - Provide the API endpoint URL
   - Enter your personal API key
   - Select the specific model you wish to benchmark
   - Click "Save" to store the configuration

2. **Managing Vendors**: All configured vendors appear in the sidebar
   - Delete unwanted configurations with the trash icon

## LLM Performance Measurement
![Performance Measurement](https://example.com/performance-screenshot.png)

To run a performance benchmark:

1. Select the vendor and model from the sidebar
2. Choose a predefined prompt template or enter a custom prompt in the text area
3. Click "Run Measurement" to initiate the benchmark
4. Observe real-time results as tokens stream in
5. Review the final performance metrics once the response completes:
   - Time to First Token (TTFT)
   - Tokens Per Second (TPS)
   - Total response time

## Managing Measurement Results
![Results Management](images/measurement.png)

The central panel displays all previous benchmark results:

1. **Results Summary**: At the top, find aggregated statistics across all measurements
   - Average TTFT and TPS across all tests
   - Performance trends over time
   - Comparative ranking of configured vendors

2. **Individual Results**: Below the summary, browse through all previous benchmark runs
   - Sorted by time
   - Remove unwanted results using the trash icon

3. **Export Result**: At the top left, export all measurement data for this account as a CSV file
   - Include data for all API vendors and all measurements
   - Sorted by time

# Development Guide

## Environment Setup

### Prerequisites
- Node.js (v16.x or later)
- npm (v8.x or later)
- PostgreSQL (v14.x or later)

### Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/tech4me/llm-api-perf-bench.git
   cd llm-api-perf-bench
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install frontend dependencies
   cd client
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   ```

## Frontend Configuration

1. Create a `.env` file in the client directory with the following variables:
   ```
   VITE_API_URL=http://localhost:3000
   VITE_BETTER_AUTH_URL=http://localhost:3000/api/auth
   ```

2. Development commands:
   ```bash
   # Start development server
   npm run dev
   
   # Build for production
   npm run build
   
   # Preview production build
   npm run start
   ```

## Backend Configuration

1. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3000
   DATABASE_URL=postgresql://username:password@localhost:5432/llm_benchmark
   CLIENT_URL=http://localhost:5173
   BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_SECRET=<your secret string>
   ```

2. Generate Prisma client files:
   ```bash
   npx prisma generate
   ```

3. Development commands:
   ```bash
   # Start development server
   npm run dev
   
   # Build for production
   npm run build
   
   # Start production server
   npm run start
   ```

## Database Setup

The application requires a PostgreSQL database. You can set it up locally or use a cloud provider.

1.  **Ensure PostgreSQL is running.**

2.  **Configure the Database Connection:**
    *   **Local Setup:** Create a new PostgreSQL database. For example, using the `createdb` command:
        ```bash
        createdb llm_benchmark
        ```
        Then, update the `DATABASE_URL` in the `server/.env` file with your local connection details (e.g., `postgresql://username:password@localhost:5432/llm_benchmark`).
    *   **Cloud Setup:** Set up a PostgreSQL database on your chosen cloud provider's platform (e.g., DigitalOcean Managed Databases, AWS RDS, Heroku Postgres). Obtain the database connection string provided by the service. Update the `DATABASE_URL` in the `server/.env` file with this connection string.

3.  **Apply the Database Schema:**
    Navigate to the `server` directory and run the Prisma command to push the schema to your configured database:
    ```bash
    cd server 
    npx prisma db push
    ```

4.  **(Optional) Explore the Database:**
    You can use Prisma Studio to view and interact with your database:
    ```bash
    npx prisma studio
    ```

# Deployment Information

The application is deployed at: [https://llm-api-perf-bench-client-tom5w.ondigitalocean.app/](https://llm-api-perf-bench-client-tom5w.ondigitalocean.app/)

## Deployment Architecture

The application utilizes DigitalOcean's App Platform for a streamlined deployment process:

### Frontend
- Deployed as a static site on DigitalOcean App Platform
- Connected to the GitHub repository for continuous deployment
- Automatically rebuilds and deploys when changes are pushed to the main branch
- Environment variables configured via the DigitalOcean dashboard

### Backend
- Deployed as a web service on DigitalOcean App Platform
- Connected to the GitHub repository for continuous deployment 
- Automatically rebuilds and deploys when changes are pushed to the main branch
- Environment variables configured via the DigitalOcean dashboard

### Database
- PostgreSQL database hosted on DigitalOcean Managed Database service
- Configured with automated backups and high availability
- Private networking enabled between the backend service and database
- Backend server added as a trusted source for secure database access

## Deployment Process
1. Push changes to the main branch on GitHub
2. DigitalOcean automatically detects changes and initiates build process
3. Application is deployed if all build steps complete successfully
4. Logs can be monitored through the DigitalOcean dashboard

# Individual Contributions

As this was a solo project, all aspects of development were handled by Shizhang Yin, including:

- Project planning and requirements analysis
- Frontend design and implementation
- Backend API development
- Database schema design and implementation
- Authentication system integration
- Documentation

All Git commits in the repository reflect this individual effort.

# Lessons Learned and Concluding Remarks

## Technical Challenges

### Bridging Local Development and Production Environments
I spent a significant percentage of development time debugging production-specific issues that didn't manifest in the local environment. Key challenges included:

- HTTP routing configurations in cloud environments
- Managing environment variables across different deployment contexts
- Resolving endpoint routing issues with various libraries
- Configuring CORS and security policies appropriately

These experiences provided valuable insights into the production deployment process and highlighted the importance of maintaining development-production parity.

### Library Documentation and Implementation Challenges
Working with Better Auth presented several unexpected challenges:

- Documentation provided high-level overviews but lacked detailed implementation examples
- Cross-subdomain cookie functionality required significant troubleshooting
- GitHub issues provided limited guidance, requiring extensive experimentation
- Resolution often came through trial and error rather than clear documentation

This experience underscored the value of comprehensive documentation with concrete examples, particularly in comparison to statically typed languages like Rust that provide compile-time checks and analysis.

## Insights and Future Directions

### Web Development Efficiency
Coming from a background in compiler engineering with C++ and other lower-level languages, this project highlighted the rapid prototyping capabilities of modern web development. The ability to quickly iterate on features and receive immediate feedback represents a significant advantage over traditional development approaches.

### API-First Development
Implementing a RESTful API architecture proved highly effective for separating concerns and enabling future extensibility. This approach has inspired ideas for future projects that could leverage simple RESTful interfaces to provide user-friendly frontends for complex backend systems.

## Conclusion
This project successfully demonstrates the value of a dedicated LLM API benchmarking tool while highlighting both the challenges and opportunities in modern web development. The combination of the React frontend and Express.js backend proved to be an efficient and effective architecture for this application. The experience gained through this project has deepened my understanding of full-stack development and will inform future work in this domain.
