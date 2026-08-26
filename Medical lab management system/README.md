# Apex Clinical Laboratories - Full-Stack LIMS Portal

A professional, clinical-grade Laboratory Information Management System (LIMS) built with a **Java REST Backend**, embedded **SQLite Database Connectivity**, and a **Natural Healthcare Frontend** interface.

---

## 🏗️ Technology Stack

- **Backend**: Java REST Server (`com.sun.net.httpserver.HttpServer` on JDK 25)
- **Database**: SQLite Embedded Relational Database (`apex_lims.db`) via SQLite JDBC
- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3 (Clinical Teal & Slate Navy)
- **Data Visualization**: Chart.js for laboratory operational metrics & patient health trends
- **Document Generation**: jsPDF & html2canvas for instant pathology report downloads

---

## 👥 Access Roles & Demo Credentials

| Role | Name | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Patient** | Rashi Pandya | `patient@lab.com` | `patient123` | View Health Trends, Update Profile, Change Password, Pay Invoices via Online Payment Gateway |
| **Doctor** | Dr. Zainab Khilji | `doctor@lab.com` | `doctor123` | Order Laboratory Tests, Review Patient Directories, Attach Clinical Pathologist Remarks |
| **Technician** | Parth Panchal | `tech@lab.com` | `tech123` | Specimen Accessioning Queue, Barcode ID Tracking, Record Test Results, Sample Rejection |
| **Admin** | Tanish Patel | `admin@lab.com` | `admin123` | Operations Dashboard, Revenue Charts, Billing Desk, User Directory, Security Audit Log |

---

## 🚀 Step-by-Step Instructions to Run the Project

### Step 1: Start the Java REST Backend Server
The Java backend handles SQLite persistence, authentication, payment gateway transactions, order processing, specimen accessioning, and audit logging on port `8080`.

#### Option A: Using the Batch File (Windows)
Open Command Prompt or PowerShell in the `Medical lab management system` folder and run:
```cmd
.\run_backend.bat
```

#### Option B: Direct Java Command
```powershell
# 1. Create bin directory if missing
New-Item -ItemType Directory -Path "backend/bin" -Force

# 2. Compile Java Source Files
& "C:\Program Files\Java\jdk-25\bin\javac.exe" -cp "backend/lib/sqlite-jdbc.jar" -d "backend/bin" backend/*.java

# 3. Start the Java REST Server
& "C:\Program Files\Java\jdk-25\bin\java.exe" -cp "backend/bin;backend/lib/sqlite-jdbc.jar" backend.LimsServer
```
*Output verification*: You will see `Apex Clinical LIMS Java REST Server Running! Listening on: http://localhost:8080`.

---

### Step 2: Launch the Frontend Web Portal

#### Option A: Direct Browser Launch
- Double-click `index.html` to open the web portal directly in Chrome, Edge, or Firefox.

#### Option B: Local Web Server (Recommended)
Run a local HTTP server in PowerShell:
```powershell
python -m http.server 8000
```
Then navigate to **`http://localhost:8000`** in your browser.

---

## 🛠️ Key Feature Breakdown

1. **Patient Profile & Security**:
   - Manage demographic info (Name, Phone, Email, DOB, Gender, Address).
   - Change Account Security Password with current password verification.
   - Interactive **Payment Gateway** (UPI / GPay, Credit/Debit Card, Net Banking) for online invoice payments.
2. **Doctor Workspace**:
   - **Order Laboratory Tests**: Select target patient, select test profiles (CBC, Lipid Profile, KFT), assign urgency priority (Routine, Urgent, STAT), and write ordering notes.
   - **Clinical Notes**: Record physician diagnostic remarks and assign severity ratings.
3. **Technician Specimen Desk**:
   - Accessioning queue with barcode tracking (`BAR-8839201`) and sample type labels.
   - **Sample Rejection**: Flag invalid samples with medical rejection reasons (Hemolyzed, Insufficient Volume, Clotted, Mislabeled), triggering instant notifications.
4. **Admin Operations & Audit Log**:
   - System Security & Activity Audit Log tracking logins, orders, sample rejections, online payments, and password changes.
5. **Notification Center**:
   - Dynamic top-bar notification drawer customized for Patient, Doctor, Technician, Admin, and Billing roles.

---

## 📤 How to Push to an Existing Git Repository (With Existing Files)

If you have an existing GitHub/GitLab repository with files already in it, follow these step-by-step git commands to safely push your project:

### Step 1: Initialize Git and Add Remote (If not already configured)
Open terminal in your project directory:
```bash
# Initialize git if needed
git init

# Check existing remotes
git remote -v

# If no remote is added, add your repository URL:
git remote add origin https://github.com/your-username/your-repository-name.git
```

### Step 2: Fetch Remote Branches & Rebase / Merge
To ensure you don't overwrite existing remote files or get rejection errors:
```bash
# Fetch latest changes from remote
git fetch origin

# Merge existing remote main branch allowing unrelated histories if starting fresh:
git pull origin main --rebase --allow-unrelated-histories
```

### Step 3: Stage and Commit Changes
```bash
# Stage all project files
git add .

# Check staged status
git status

# Commit changes with a descriptive message
git commit -m "feat: add full-stack LIMS with Java REST backend, SQLite DB, Patient Profile, Payment Gateway, Doctor Orders, Specimen Rejection & Audit Log"
```

### Step 4: Push to Remote Repository
```bash
# Push committed files to main branch
git push -u origin main
```

> [!TIP]
> If the remote repository has strict protected branches or conflicting commits, pull first using `git pull origin main --rebase` before pushing.

