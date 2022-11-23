import React from 'react';
import { Rubik } from '@next/font/google';
import './globals.css';

const rubik = Rubik();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={rubik.className}>
      <head>
        <link rel="icon" href="/source/typescript/nextjs/02_crud_frontend/public/favicon.ico" />
        <title>{{.ProjectName}} App using Next.js 13 + Tigris</title>
        <meta name="description" content="Generated Tigris application" />
      </head>
      <body>{children}</body>
    </html>
  );
}
