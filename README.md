# V6Pictures React

A modern React-based version of the V6Pictures billing and invoice system. This project is built using React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

## Features

- Modern UI with responsive design
- Billing form for creating invoices
- Print-friendly invoice page
- Quote generation functionality
- Static site generation for easy deployment
- Docker support for containerized deployment

## Prerequisites

### For Local Development
- Node.js (v18 or higher)
- npm or yarn

### For Docker Deployment
- Docker
- Docker Compose

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/v6pictures_react.git
cd v6pictures_react
```

2. Install dependencies:

```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

This will start the development server at http://localhost:5173.

## Building for Production

To build the project for production:

```bash
npm run build
```

This will create a `dist` directory with the built files.

## Serving the Production Build

To preview the production build locally:

```bash
npm run serve
```

## Docker Deployment

### Quick Start with Docker Compose

1. Build and run the application using Docker Compose:

```bash
docker-compose up --build
```

The application will be available at http://localhost:3000

2. To run in detached mode:

```bash
docker-compose up -d --build
```

3. To stop the application:

```bash
docker-compose down
```

### Manual Docker Commands

1. Build the Docker image:

```bash
docker build -t v6pictures-react .
```

2. Run the container:

```bash
docker run -d -p 3000:80 --name v6pictures-app v6pictures-react
```

3. Stop and remove the container:

```bash
docker stop v6pictures-app
docker rm v6pictures-app
```

### Docker Configuration

- **Port**: The application runs on port 80 inside the container and is exposed on port 3000 on the host
- **Network**: Uses a custom bridge network `v6pictures-network`
- **Health Check**: Includes health check endpoint at `/health`
- **Security**: Runs as non-root user for enhanced security
- **Optimization**: Multi-stage build with nginx for production serving
- **AWS EC2 Compatibility**: Includes explicit entrypoint script for AWS EC2 deployment

## Troubleshooting Docker Deployment

### AWS EC2 Specific Issues

#### Entrypoint Error

If you encounter an error like `exec /docker-entrypoint.sh` when running the Docker image on AWS EC2:

1. This is typically caused by permission issues or missing entrypoint script
2. The Dockerfile now includes an explicit entrypoint script to resolve this issue
3. If you still encounter issues, verify that the entrypoint script has proper execution permissions:

```bash
# Connect to your running container
docker exec -it v6pictures-app sh

# Check if the entrypoint script exists and has execution permissions
ls -la /docker-entrypoint.sh

# If needed, set proper permissions
chmod +x /docker-entrypoint.sh
```

#### Platform Compatibility

If you're building on a different architecture than your deployment target:

1. Ensure you're building for the correct platform using the `--platform` flag
2. For AWS EC2 (typically x86_64/amd64), build with:

```bash
docker build --platform linux/amd64 -t v6pictures-react .
```

## Traditional Deployment

The built files in the `dist` directory can be deployed to any static web server, such as Nginx, Apache, or services like Netlify, Vercel, or GitHub Pages.

### Nginx Configuration Example

Here's a basic Nginx configuration for serving the static site:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /path/to/v6pictures_react/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Project Structure

- `src/components/`: React components
  - `ui/`: shadcn/ui components
  - `layout/`: Layout components like Navbar
- `src/pages/`: Page components
- `src/data/`: JSON data files
- `public/`: Static assets

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
