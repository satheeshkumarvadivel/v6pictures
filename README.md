# V6Pictures React

A modern React-based version of the V6Pictures billing and invoice system. This project is built using React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

## Features

- Modern UI with responsive design
- Billing form for creating invoices
- Print-friendly invoice page
- Static site generation for easy deployment

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

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

## Deployment

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
