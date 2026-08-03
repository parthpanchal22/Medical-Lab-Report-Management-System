# Apex Clinical Laboratories - LIMS Portal

A professional, clinical-grade Laboratory Information Management System (LIMS) designed for managing pathology workflows, specimen accessioning, diagnostics billing, and pathology reporting.

## Key Upgrades
- **Natural, Clinical Light Theme**: Transitioned from a high-tech glowing "AI-style" glassmorphic dark theme to a clean, clinical light-grey and medical-teal styling layout.
- **Realistic Clinical Copy**: Replaced glowing tech buzzwords with actual healthcare vocabulary (e.g. LIMS, Specimen Accessioning, Biological Reference Intervals).
- **Inline PDF Specimen Assets**: Integrates clean vector SVGs directly inside pathology PDF report compiles to guarantee instant, offline rendering without CORS or relative image path blocks.
- **Responsive Theme Charts**: Integrates grid lines and contrast label colors in Chart.js that dynamically redraw and refresh upon Dark/Light theme toggles.
- **Workflow Security Safeguards**: Prevents specimen completions without results input, blocks negative values on metric validation checks, and calculates billing summaries live.

## Access Roles & Demo Credentials
Click the credentials pills on the Sign In page to immediately boot into any of these active directories:
- **Admin** (Tanish Patel): `admin@lab.com` / `admin123`
- **Technician** (Parth Panchal): `tech@lab.com` / `tech123`
- **Doctor** (Dr. Zainab Khilji): `doctor@lab.com` / `doctor123`
- **Patient** (Rashi Pandya): `patient@lab.com` / `patient123`

## Quick Launch
1. **Direct Preview**: Double-click [index.html](file:///C:/Users/Prakash/.gemini/antigravity/scratch/medical-lab-report-system/index.html) to open the web portal locally.
2. **Clinical Local Server**: Run `python -m http.server 8000` or `npx -y http-server -p 8000` in the directory, then navigate to `http://localhost:8000`.
