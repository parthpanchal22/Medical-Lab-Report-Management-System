package backend;

import java.io.File;
import java.sql.*;
import java.util.*;

public class DatabaseManager {
    private static final String DB_URL = "jdbc:sqlite:apex_lims.db";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL);
    }

    public static void initializeDatabase() {
        try {
            Class.forName("org.sqlite.JDBC");
        } catch (ClassNotFoundException e) {
            System.err.println("SQLite JDBC Driver not found: " + e.getMessage());
        }

        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            // Enable PRAGMAs
            stmt.execute("PRAGMA foreign_keys = ON;");

            // 1. Users Table
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    role TEXT NOT NULL,
                    phone TEXT,
                    dob TEXT,
                    gender TEXT,
                    address TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """);

            // 2. Test Catalog Table
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS catalog (
                    id TEXT PRIMARY KEY,
                    code TEXT NOT NULL,
                    name TEXT NOT NULL,
                    category TEXT NOT NULL,
                    price REAL NOT NULL,
                    turnaround_hours INTEGER NOT NULL,
                    description TEXT,
                    parameters_json TEXT NOT NULL
                );
            """);

            // 3. Orders Table
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS orders (
                    id TEXT PRIMARY KEY,
                    patient_id TEXT NOT NULL,
                    patient_name TEXT NOT NULL,
                    doctor_id TEXT,
                    doctor_name TEXT,
                    test_ids TEXT NOT NULL,
                    test_names TEXT NOT NULL,
                    status TEXT NOT NULL,
                    priority TEXT DEFAULT 'Routine',
                    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    notes TEXT
                );
            """);

            // 4. Specimens Table
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS specimens (
                    id TEXT PRIMARY KEY,
                    order_id TEXT NOT NULL,
                    patient_name TEXT NOT NULL,
                    test_name TEXT NOT NULL,
                    specimen_type TEXT NOT NULL,
                    barcode TEXT NOT NULL,
                    stage TEXT NOT NULL,
                    collection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    rejection_reason TEXT,
                    rejection_date TIMESTAMP,
                    technician_name TEXT
                );
            """);

            // 5. Invoices Table
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS invoices (
                    id TEXT PRIMARY KEY,
                    order_id TEXT NOT NULL,
                    patient_id TEXT NOT NULL,
                    patient_name TEXT NOT NULL,
                    test_names TEXT NOT NULL,
                    subtotal REAL NOT NULL,
                    discount REAL DEFAULT 0,
                    total_amount REAL NOT NULL,
                    billing_date TEXT NOT NULL,
                    status TEXT DEFAULT 'Unpaid'
                );
            """);

            // 6. Payments Table
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS payments (
                    id TEXT PRIMARY KEY,
                    invoice_id TEXT NOT NULL,
                    patient_id TEXT NOT NULL,
                    patient_name TEXT NOT NULL,
                    amount REAL NOT NULL,
                    payment_method TEXT NOT NULL,
                    transaction_id TEXT NOT NULL,
                    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status TEXT DEFAULT 'Completed',
                    verified_by_admin INTEGER DEFAULT 1
                );
            """);

            // 7. Clinical Notes Table
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS clinical_notes (
                    id TEXT PRIMARY KEY,
                    patient_id TEXT NOT NULL,
                    patient_name TEXT NOT NULL,
                    doctor_id TEXT NOT NULL,
                    doctor_name TEXT NOT NULL,
                    order_id TEXT,
                    severity TEXT NOT NULL,
                    notes_text TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """);

            // 8. Audit Logs Table
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS audit_logs (
                    id TEXT PRIMARY KEY,
                    user_name TEXT NOT NULL,
                    role TEXT NOT NULL,
                    action TEXT NOT NULL,
                    category TEXT NOT NULL,
                    details TEXT NOT NULL,
                    ip_address TEXT DEFAULT '127.0.0.1',
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """);

            // 9. Notifications Table
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS notifications (
                    id TEXT PRIMARY KEY,
                    target_role TEXT NOT NULL,
                    target_user_id TEXT,
                    message TEXT NOT NULL,
                    type TEXT DEFAULT 'info',
                    is_read INTEGER DEFAULT 0,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """);

            seedInitialData(conn);
            System.out.println("SQLite Database initialized & schema verified successfully.");
        } catch (SQLException e) {
            System.err.println("Error initializing database: " + e.getMessage());
        }
    }

    private static void seedInitialData(Connection conn) throws SQLException {
        // Check if users exist
        try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM users")) {
            if (rs.next() && rs.getInt(1) > 0) {
                return; // Data already seeded
            }
        }

        // 1. Seed Users
        String insertUser = "INSERT INTO users (id, name, email, password, role, phone, dob, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement pstmt = conn.prepareStatement(insertUser)) {
            // Admin
            pstmt.setString(1, "usr-admin");
            pstmt.setString(2, "Tanish Patel");
            pstmt.setString(3, "admin@lab.com");
            pstmt.setString(4, "admin123");
            pstmt.setString(5, "admin");
            pstmt.setString(6, "+91 98765 43210");
            pstmt.setString(7, "1988-04-12");
            pstmt.setString(8, "Male");
            pstmt.setString(9, "Building 4, Healthcare Park, Mumbai");
            pstmt.addBatch();

            // Tech
            pstmt.setString(1, "usr-tech");
            pstmt.setString(2, "Parth Panchal");
            pstmt.setString(3, "tech@lab.com");
            pstmt.setString(4, "tech123");
            pstmt.setString(5, "technician");
            pstmt.setString(6, "+91 98765 43211");
            pstmt.setString(7, "1993-08-21");
            pstmt.setString(8, "Male");
            pstmt.setString(9, "Flat 102, Lab Staff Quarters, Mumbai");
            pstmt.addBatch();

            // Doctor
            pstmt.setString(1, "usr-doctor");
            pstmt.setString(2, "Dr. Zainab Khilji");
            pstmt.setString(3, "doctor@lab.com");
            pstmt.setString(4, "doctor123");
            pstmt.setString(5, "doctor");
            pstmt.setString(6, "+91 98765 43212");
            pstmt.setString(7, "1982-11-05");
            pstmt.setString(8, "Female");
            pstmt.setString(9, "Suite 501, Apex Medical Center, Mumbai");
            pstmt.addBatch();

            // Patient
            pstmt.setString(1, "usr-patient");
            pstmt.setString(2, "Rashi Pandya");
            pstmt.setString(3, "patient@lab.com");
            pstmt.setString(4, "patient123");
            pstmt.setString(5, "patient");
            pstmt.setString(6, "+91 98765 43213");
            pstmt.setString(7, "1998-02-14");
            pstmt.setString(8, "Female");
            pstmt.setString(9, "22 Silicon Residency, Andheri West, Mumbai");
            pstmt.addBatch();

            pstmt.executeBatch();
        }

        // 2. Seed Test Catalog
        String insertCatalog = "INSERT INTO catalog (id, code, name, category, price, turnaround_hours, description, parameters_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement pstmt = conn.prepareStatement(insertCatalog)) {
            // CBC
            pstmt.setString(1, "cat-cbc");
            pstmt.setString(2, "CBC");
            pstmt.setString(3, "Complete Blood Count");
            pstmt.setString(4, "Hematology");
            pstmt.setDouble(5, 450.0);
            pstmt.setInt(6, 12);
            pstmt.setString(7, "Evaluates overall health and detects a wide range of disorders including anemia and infection.");
            pstmt.setString(8, "[{\"name\":\"Hemoglobin\",\"unit\":\"g/dL\",\"ref\":\"12.0 - 16.0\",\"value\":13.8},{\"name\":\"WBC Count\",\"unit\":\"x10^3/µL\",\"ref\":\"4.5 - 11.0\",\"value\":7.2},{\"name\":\"Platelet Count\",\"unit\":\"x10^3/µL\",\"ref\":\"150 - 450\",\"value\":240}]");
            pstmt.addBatch();

            // LPF
            pstmt.setString(1, "cat-lpf");
            pstmt.setString(2, "LPF");
            pstmt.setString(3, "Lipid Profile Panel");
            pstmt.setString(4, "Biochemistry");
            pstmt.setDouble(5, 750.0);
            pstmt.setInt(6, 24);
            pstmt.setString(7, "Measures circulating cholesterol and triglycerides to assess cardiovascular disease risk.");
            pstmt.setString(8, "[{\"name\":\"Total Cholesterol\",\"unit\":\"mg/dL\",\"ref\":\"< 200\",\"value\":185},{\"name\":\"HDL Cholesterol\",\"unit\":\"mg/dL\",\"ref\":\"> 40\",\"value\":52},{\"name\":\"Triglycerides\",\"unit\":\"mg/dL\",\"ref\":\"< 150\",\"value\":130}]");
            pstmt.addBatch();

            // KFT
            pstmt.setString(1, "cat-kft");
            pstmt.setString(2, "KFT");
            pstmt.setString(3, "Kidney Function Test");
            pstmt.setString(4, "Nephrology");
            pstmt.setDouble(5, 650.0);
            pstmt.setInt(6, 12);
            pstmt.setString(7, "Evaluates renal filtration efficacy including serum urea, creatinine, and electrolytes.");
            pstmt.setString(8, "[{\"name\":\"Serum Creatinine\",\"unit\":\"mg/dL\",\"ref\":\"0.6 - 1.2\",\"value\":0.9},{\"name\":\"Blood Urea Nitrogen\",\"unit\":\"mg/dL\",\"ref\":\"7 - 20\",\"value\":14}]");
            pstmt.addBatch();

            pstmt.executeBatch();
        }

        // 3. Seed Initial Invoices
        String insertInvoice = "INSERT INTO invoices (id, order_id, patient_id, patient_name, test_names, subtotal, discount, total_amount, billing_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement pstmt = conn.prepareStatement(insertInvoice)) {
            pstmt.setString(1, "INV-1001");
            pstmt.setString(2, "ORD-501");
            pstmt.setString(3, "usr-patient");
            pstmt.setString(4, "Rashi Pandya");
            pstmt.setString(5, "Complete Blood Count (CBC)");
            pstmt.setDouble(6, 450.0);
            pstmt.setDouble(7, 45.0);
            pstmt.setDouble(8, 405.0);
            pstmt.setString(9, "2026-08-24");
            pstmt.setString(10, "Paid");
            pstmt.addBatch();

            pstmt.setString(1, "INV-1002");
            pstmt.setString(2, "ORD-502");
            pstmt.setString(3, "usr-patient");
            pstmt.setString(4, "Rashi Pandya");
            pstmt.setString(5, "Lipid Profile Panel");
            pstmt.setDouble(6, 750.0);
            pstmt.setDouble(7, 75.0);
            pstmt.setDouble(8, 675.0);
            pstmt.setString(9, "2026-08-25");
            pstmt.setString(10, "Unpaid");
            pstmt.addBatch();

            pstmt.executeBatch();
        }

        // 4. Seed Initial Payments
        String insertPayment = "INSERT INTO payments (id, invoice_id, patient_id, patient_name, amount, payment_method, transaction_id, status, verified_by_admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement pstmt = conn.prepareStatement(insertPayment)) {
            pstmt.setString(1, "PAY-9001");
            pstmt.setString(2, "INV-1001");
            pstmt.setString(3, "usr-patient");
            pstmt.setString(4, "Rashi Pandya");
            pstmt.setDouble(5, 405.0);
            pstmt.setString(6, "UPI / GPay");
            pstmt.setString(7, "TXN98421045");
            pstmt.setString(8, "Completed");
            pstmt.setInt(9, 1);
            pstmt.addBatch();

            pstmt.executeBatch();
        }

        // 5. Seed Initial Specimens
        String insertSpecimen = "INSERT INTO specimens (id, order_id, patient_name, test_name, specimen_type, barcode, stage, technician_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement pstmt = conn.prepareStatement(insertSpecimen)) {
            pstmt.setString(1, "SPEC-101");
            pstmt.setString(2, "ORD-501");
            pstmt.setString(3, "Rashi Pandya");
            pstmt.setString(4, "Complete Blood Count (CBC)");
            pstmt.setString(5, "EDTA Whole Blood");
            pstmt.setString(6, "BAR-8839201");
            pstmt.setString(7, "Certified");
            pstmt.setString(8, "Parth Panchal");
            pstmt.addBatch();

            pstmt.setString(1, "SPEC-102");
            pstmt.setString(2, "ORD-502");
            pstmt.setString(3, "Rashi Pandya");
            pstmt.setString(4, "Lipid Profile Panel");
            pstmt.setString(5, "Serum Separator (SST)");
            pstmt.setString(6, "BAR-8839202");
            pstmt.setString(7, "Collected");
            pstmt.setString(8, "Parth Panchal");
            pstmt.addBatch();

            pstmt.executeBatch();
        }

        // 6. Seed Initial Clinical Notes
        String insertNote = "INSERT INTO clinical_notes (id, patient_id, patient_name, doctor_id, doctor_name, order_id, severity, notes_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement pstmt = conn.prepareStatement(insertNote)) {
            pstmt.setString(1, "NOTE-101");
            pstmt.setString(2, "usr-patient");
            pstmt.setString(3, "Rashi Pandya");
            pstmt.setString(4, "usr-doctor");
            pstmt.setString(5, "Dr. Zainab Khilji");
            pstmt.setString(6, "ORD-501");
            pstmt.setString(7, "Normal");
            pstmt.setString(8, "Patient Hemoglobin (13.8 g/dL) and WBC parameters are within healthy baseline intervals. Continue annual wellness monitoring.");
            pstmt.addBatch();

            pstmt.executeBatch();
        }

        // 7. Seed Audit Logs
        String insertAudit = "INSERT INTO audit_logs (id, user_name, role, action, category, details) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement pstmt = conn.prepareStatement(insertAudit)) {
            pstmt.setString(1, "AUD-001");
            pstmt.setString(2, "Tanish Patel");
            pstmt.setString(3, "Admin");
            pstmt.setString(4, "System Startup");
            pstmt.setString(5, "System");
            pstmt.setString(6, "Apex LIMS Java REST Database engine initialized.");
            pstmt.addBatch();

            pstmt.setString(1, "AUD-002");
            pstmt.setString(2, "Dr. Zainab Khilji");
            pstmt.setString(3, "Doctor");
            pstmt.setString(4, "Clinical Note Created");
            pstmt.setString(5, "Clinical Notes");
            pstmt.setString(6, "Attached clinical guidance note for Rashi Pandya on Order #ORD-501.");
            pstmt.addBatch();

            pstmt.setString(1, "AUD-003");
            pstmt.setString(2, "Rashi Pandya");
            pstmt.setString(3, "Patient");
            pstmt.setString(4, "Online Payment");
            pstmt.setString(5, "Billing");
            pstmt.setString(6, "Paid ₹405.00 online for Invoice #INV-1001 via UPI.");
            pstmt.addBatch();

            pstmt.executeBatch();
        }

        // 8. Seed Notifications
        String insertNotif = "INSERT INTO notifications (id, target_role, message, type) VALUES (?, ?, ?, ?)";
        try (PreparedStatement pstmt = conn.prepareStatement(insertNotif)) {
            pstmt.setString(1, "NOTIF-1");
            pstmt.setString(2, "patient");
            pstmt.setString(3, "Your report for Complete Blood Count (CBC) is ready to download.");
            pstmt.setString(4, "success");
            pstmt.addBatch();

            pstmt.setString(1, "NOTIF-2");
            pstmt.setString(2, "doctor");
            pstmt.setString(3, "Critical result requires attention: High Glucose detected for sample SPEC-102.");
            pstmt.setString(4, "warning");
            pstmt.addBatch();

            pstmt.setString(1, "NOTIF-3");
            pstmt.setString(2, "technician");
            pstmt.setString(3, "New specimen assigned: Order #ORD-502 (Serum Separator Tube).");
            pstmt.setString(4, "info");
            pstmt.addBatch();

            pstmt.setString(1, "NOTIF-4");
            pstmt.setString(2, "admin");
            pstmt.setString(3, "5 reports are pending verification in laboratory queue.");
            pstmt.setString(4, "warning");
            pstmt.addBatch();

            pstmt.setString(1, "NOTIF-5");
            pstmt.setString(2, "billing");
            pstmt.setString(3, "3 invoices are unpaid in billing system.");
            pstmt.setString(4, "info");
            pstmt.addBatch();

            pstmt.executeBatch();
        }

        System.out.println("Initial LIMS clinical seed data inserted successfully.");
    }
}
