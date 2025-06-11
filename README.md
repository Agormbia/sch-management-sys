# School Management System

A comprehensive school management system built with Next.js, TypeScript, Prisma, and Tailwind CSS.

## Features

- **Student Management**: Complete student admission, records, and academic tracking
- **Teacher Management**: Teacher profiles, subject assignments, and class management
- **Class Management**: Classroom organization and student assignments
- **Subject Management**: Subject creation and teacher assignments
- **Dashboard**: Real-time statistics and recent activities
- **File Uploads**: Student photos and document management
- **Search & Filter**: Advanced search capabilities across all modules
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL (configurable for MySQL/SQLite)
- **UI Components**: Radix UI, Lucide React
- **Forms**: React Hook Form, Zod validation
- **File Upload**: Support for Cloudinary/AWS S3

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL (or MySQL/SQLite)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database and configuration details.

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Lama Dev Youtube Channel](https://youtube.com/lamadev) 
- [Next.js](https://nextjs.org/learn)