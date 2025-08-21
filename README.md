# Invoice Application

A modern, responsive invoice management application built with Angular. This application helps users create, manage, and track invoices with a beautiful and intuitive user interface.

## Features

- Create and manage invoices
- Dark/Light theme support
- Responsive design for all devices
- Modern UI with smooth animations
- Form validation and error handling
- Data persistence

## Technologies Used

- Angular
- SCSS/Sass
- TypeScript
- HTML5
- CSS3

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v14 or higher)

## Getting Started

1. Clone the repository:

```bash
git clone [repository-url]
cd invoice-application
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## Project Structure

```
invoice-application/
├── src/                    # Source files
│   ├── app/               # Application components
│   ├── assets/            # Static assets
│   └── styles.scss        # Global styles
├── public/                # Public assets
├── .github/               # GitHub configuration
│   └── workflows/         # GitHub Actions workflows
│       └── deploy.yml     # Automated deployment workflow
├── angular.json           # Angular configuration
├── package.json           # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── deploy.sh             # Manual deployment script
```

## Development

### Code Style

This project uses Prettier for code formatting. The configuration can be found in `.prettierrc`.

### Building for Production

To build the project for production:

```bash
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

This application is deployed using AWS S3 for static hosting and CloudFront for content delivery. Our deployment architecture prioritizes security, performance, and cost-effectiveness.

### Deployment Architecture

```
Internet → CloudFront Distribution → S3 Bucket (Private)
```

### Why This Architecture?

1. **Security First**
   - Private S3 bucket prevents direct access to source files
   - CloudFront as gateway with secure bucket policies
   - No public exposure of application files

2. **Performance Benefits**
   - Global CDN with edge locations worldwide
   - Automatic caching and compression
   - Reduced latency for users globally

3. **Cost Optimization**
   - Low-cost S3 storage for static files
   - Pay-per-use CloudFront pricing
   - No server costs (eliminates EC2/compute costs)

4. **Scalability**
   - Automatic handling of traffic spikes
   - Global reach with minimal latency
   - High availability with 99.9% uptime SLA

### Prerequisites

- Node.js and Angular CLI installed
- AWS account with S3 and CloudFront access
- AWS credentials configured (Access Key ID and Secret Access Key)

### Deployment Steps

1. **Build the Application**
   ```bash
   npm install
   npm run build
   ```

2. **Create S3 Bucket**
   - Create a private S3 bucket
   - Enable versioning (recommended)

3. **Configure S3 Bucket Policy**
   - Allow only CloudFront access through bucket policies
   - Ensure bucket remains private

4. **Create CloudFront Distribution**
   - Configure origin pointing to S3 bucket
   - Set up error pages for Angular routing (403/404 → index.html)
   - Enable HTTPS and compression

5. **Upload Application Files**
   ```bash
   # Use your preferred AWS deployment method
   # Files should be uploaded to S3 bucket root
   # Set proper cache headers for index.html
   ```

6. **Configure Error Pages**
   - 403 Error: Redirect to `/index.html` with 200 status
   - 404 Error: Redirect to `/index.html` with 200 status
   - This ensures Angular's client-side routing works correctly

### Automated Deployment

#### Option 1: Manual Deployment Script

Use the included `deploy.sh` script for easy deployments:

```bash
# Set environment variables
export S3_BUCKET_NAME="your-bucket-name"
export CLOUDFRONT_DISTRIBUTION_ID="your-distribution-id"

# Run deployment
./deploy.sh
```

#### Option 2: GitHub Actions (Recommended)

For automated CI/CD, use GitHub Actions with the included workflow. This automatically builds and deploys your application on every push to the main branch.

**Setup:**

1. **Add AWS Secrets to GitHub Repository:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `AWS_ACCESS_KEY_ID`: Your AWS access key
     - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
     - `S3_BUCKET_NAME`: Your S3 bucket name
     - `CLOUDFRONT_DISTRIBUTION_ID`: Your CloudFront distribution ID
     - `AWS_REGION`: Your AWS region (e.g., us-east-1)

2. **Workflow File:**
   The `.github/workflows/deploy.yml` file is already configured and will:
   - Trigger on pushes to main branch
   - Install dependencies
   - Build the Angular application
   - Deploy to S3
   - Invalidate CloudFront cache
   - Handle Angular routing properly

**Benefits of GitHub Actions:**
- **Automated deployments** on every code push
- **No manual intervention** required
- **Consistent deployment process** across team
- **Rollback capability** through S3 versioning
- **Security** through GitHub secrets management
- **Integration** with pull request workflows

### Security Considerations

- HTTPS enforcement through CloudFront
- Private S3 bucket with no direct access
- Origin access control between CloudFront and S3
- Optional WAF integration for additional security

### Cost Optimization

- S3 Storage: ~$0.023 per GB/month
- CloudFront: ~$0.085 per GB for first 10TB
- Free tier: 1GB CloudFront data transfer per month
- No data transfer costs between S3 and CloudFront

For detailed deployment configuration and troubleshooting, refer to the AWS documentation or contact your DevOps team.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by [Frontend Mentor](https://www.frontendmentor.io/)
- Icons from [Material Icons](https://material.io/resources/icons/)
