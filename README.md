# Hospital Scan Archive System (HSAS)


## Overview

The Hospital Scan Archive System (HSAS) is a web application designed to automate the management of medical scans in a hospital. Administrators, doctors, and nurses can utilize the system to upload and download scans, manage patient records, and perform various administrative tasks. The system incorporates role-based authentication, ensuring secure access to specific functionalities for each user role.

## Project Structure

### Framework and Tools

The project is built using the following frameworks and tools:

- React (Vite)
- Tailwind CSS
- React Router
- React Toastify
- React Icons
- Tanstack/React Table
- JWT Decode

### User Roles and Features

#### Administrators
- Dashboard:
    - Display import statistics.
    - Show tables of recently added scans and specialists.
- Account Management:
    - Create accounts for administrators, doctors, and nurses.
    - Update, delete, and view all admins, doctors, and nurses.
- Scan Management:
    - Create, update, delete, and view all scans.
- Patient Management:
    - Create, update, delete, and view all patients.
- Profile:
    - Update administrator's profile.

#### Doctors

- Dashboard:
    - Display important statistics related to the authenticated doctor.
    - Show tables of scans recently prescribed by the doctor.
- Scan Management:
    - View scans prescribed by the doctor.
    - Upload scans for a particular patient.
    - Download a patient's uploaded scans.
- Profile:
    - View and update the doctor's profile.

#### Nurses

- Profile:
    - View basic information on the nurse's profile.
- Patient Management:
    - Create, update, delete, and view patients.
    - Upload scans prescribed by a particular doctor.
    - View patients' scan details.
    - Download patient scans.

### Features

- Role-Based Authentication:
    - Sessions expire after 1 hour, automatically logging out users.
- User Profile Management:
    - Users can view and update their profiles.
- Medical Scan Upload and Download:
    - Doctors and nurses can upload and download medical scans.
- Filtering and Searching Tabular Data:
    - Users can filter and search tabular data.
- Pagination of Tabular Data:
    - Tabular data is paginated for improved navigation.
- Download CSV File:
    - Users can download a CSV file of tabular data.
- Dashboard View:
    - Administrators and doctors have personalized dashboards.

### Usage

1. Clone the Repository:
``` git clone https://github.com/your-username/hsas.git ```
``` cd hsas ```

2. Install Dependencies:
``` npm install ```

3. Preview in Browser (dev mode):
``` npm run dev ```

4. Build:
``` npm run build && npm run preview ```