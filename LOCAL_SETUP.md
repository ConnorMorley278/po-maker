# Running PO Maker Locally

This application runs privately on your computer only. It is NOT accessible from the internet.

## Prerequisites

- Node.js 18+ installed
- Your Supabase project URL and anon key in `.env.local`

## Starting the Application

1. Open Command Prompt or PowerShell
2. Navigate to the project folder:
   ```
   cd C:\Users\javan\po-maker
   ```

3. Install dependencies (first time only):
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and go to:
   ```
   http://localhost:3000
   ```

The application is now running on your computer only. Close the Command Prompt window to stop the application.

## What You Can Do

- Create, view, and manage purchase orders
- Manage vendors
- Store company information in Settings
- Everything is saved to your Supabase database

## Database

Your data is stored in Supabase (cloud database). As long as you have internet, your data syncs.

## Stopping the Application

Press `Ctrl+C` in the Command Prompt window where `npm run dev` is running.

## Restarting

Repeat the steps above, starting from step 4.

## Importing Existing Purchase Orders

To import your 5 existing POs (PO-101 through PO-106):

1. Edit `scripts/import-pos.js` with your PO details and vendor ID
2. In Command Prompt (with app still running in another window):
   ```
   node scripts/import-pos.js
   ```
3. Refresh your browser - POs will appear on the dashboard
