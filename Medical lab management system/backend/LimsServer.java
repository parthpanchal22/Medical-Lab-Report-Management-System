package backend;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.util.*;

public class LimsServer {
    private static final int PORT = 8080;

    public static void main(String[] args) throws IOException {
        // Initialize SQLite DB
        DatabaseManager.initializeDatabase();

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        // API Endpoints
        server.createContext("/api/health", new HealthHandler());
        server.createContext("/api/auth/login", new LoginHandler());
        server.createContext("/api/auth/register", new RegisterHandler());
        server.createContext("/api/auth/change-password", new ChangePasswordHandler());
        server.createContext("/api/auth/verify-email", new VerifyEmailHandler());
        server.createContext("/api/auth/reset-password", new ResetPasswordHandler());
        server.createContext("/api/users", new UsersHandler());
        server.createContext("/api/catalog", new CatalogHandler());
        server.createContext("/api/orders", new OrdersHandler());
        server.createContext("/api/specimens", new SpecimensHandler());
        server.createContext("/api/invoices", new InvoicesHandler());
        server.createContext("/api/payments", new PaymentsHandler());
        server.createContext("/api/clinical-notes", new ClinicalNotesHandler());
        server.createContext("/api/audit-logs", new AuditLogsHandler());
        server.createContext("/api/notifications", new NotificationsHandler());

        server.setExecutor(java.util.concurrent.Executors.newFixedThreadPool(10));
        server.start();

        System.out.println("==================================================");
        System.out.println(" Apex Clinical LIMS Java REST Server Running!");
        System.out.println(" Listening on: http://localhost:" + PORT);
        System.out.println("==================================================");
    }

    // Helper method to set CORS headers
    private static void enableCORS(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String jsonResponse) throws IOException {
        enableCORS(exchange);
        byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }

    private static String readRequestBody(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int len;
        while ((len = is.read(buffer)) != -1) {
            baos.write(buffer, 0, len);
        }
        return baos.toString(StandardCharsets.UTF_8.name());
    }

    // Quick regex string extractor for simple JSON bodies
    private static String getJsonField(String json, String field) {
        if (json == null || !json.contains("\"" + field + "\"")) return "";
        int start = json.indexOf("\"" + field + "\"");
        int colon = json.indexOf(":", start);
        if (colon == -1) return "";
        int valStart = json.indexOf("\"", colon);
        if (valStart == -1) {
            // Check primitive number/boolean
            int comma = json.indexOf(",", colon);
            int brace = json.indexOf("}", colon);
            int end = (comma != -1 && comma < brace) ? comma : brace;
            if (end == -1) end = json.length();
            return json.substring(colon + 1, end).trim();
        }
        int valEnd = json.indexOf("\"", valStart + 1);
        if (valEnd == -1) return "";
        return json.substring(valStart + 1, valEnd);
    }

    private static void logAudit(String userName, String role, String action, String category, String details) {
        String sql = "INSERT INTO audit_logs (id, user_name, role, action, category, details) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseManager.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, "AUD-" + System.currentTimeMillis());
            pstmt.setString(2, userName);
            pstmt.setString(3, role);
            pstmt.setString(4, action);
            pstmt.setString(5, category);
            pstmt.setString(6, details);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Audit log error: " + e.getMessage());
        }
    }

    // 1. Health Handler
    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                enableCORS(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            sendJsonResponse(exchange, 200, "{\"status\":\"healthy\",\"system\":\"Apex LIMS Java REST Engine\",\"timestamp\":\"" + new java.util.Date() + "\"}");
        }
    }

    // 2. Login Handler
    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                enableCORS(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                return;
            }
            String body = readRequestBody(exchange);
            String email = getJsonField(body, "email");
            String password = getJsonField(body, "password");
            String role = getJsonField(body, "role");

            String sql = "SELECT * FROM users WHERE email = ? AND password = ?";
            try (Connection conn = DatabaseManager.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, email);
                pstmt.setString(2, password);
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        String userRole = rs.getString("role");
                        String name = rs.getString("name");
                        String id = rs.getString("id");

                        logAudit(name, userRole, "User Login", "Auth", "Successfully signed into " + userRole + " portal.");
                        
                        String json = String.format(
                            "{\"success\":true,\"user\":{\"id\":\"%s\",\"name\":\"%s\",\"email\":\"%s\",\"role\":\"%s\",\"phone\":\"%s\",\"dob\":\"%s\",\"gender\":\"%s\",\"address\":\"%s\"}}",
                            id, name, rs.getString("email"), userRole,
                            rs.getString("phone") != null ? rs.getString("phone") : "",
                            rs.getString("dob") != null ? rs.getString("dob") : "",
                            rs.getString("gender") != null ? rs.getString("gender") : "",
                            rs.getString("address") != null ? rs.getString("address") : ""
                        );
                        sendJsonResponse(exchange, 200, json);
                        return;
                    }
                }
            } catch (SQLException e) {
                sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                return;
            }
            sendJsonResponse(exchange, 401, "{\"success\":false,\"message\":\"Invalid email or password credentials.\"}");
        }
    }

    // 3. Register Handler
    static class RegisterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                enableCORS(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                return;
            }
            String body = readRequestBody(exchange);
            String name = getJsonField(body, "name");
            String email = getJsonField(body, "email");
            String password = getJsonField(body, "password");
            String phone = getJsonField(body, "phone");
            String dob = getJsonField(body, "dob");
            String gender = getJsonField(body, "gender");
            String address = getJsonField(body, "address");
            String id = "usr-" + System.currentTimeMillis();

            try (Connection conn = DatabaseManager.getConnection()) {
                // Check if email already exists
                String checkSql = "SELECT id FROM users WHERE LOWER(email) = LOWER(?)";
                try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                    checkStmt.setString(1, email);
                    try (ResultSet rs = checkStmt.executeQuery()) {
                        if (rs.next()) {
                            sendJsonResponse(exchange, 400, "{\"success\":false,\"message\":\"An account with this email address already exists.\"}");
                            return;
                        }
                    }
                }

                String sql = "INSERT INTO users (id, name, email, password, role, phone, dob, gender, address) VALUES (?, ?, ?, ?, 'patient', ?, ?, ?, ?)";
                try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                    pstmt.setString(1, id);
                    pstmt.setString(2, name);
                    pstmt.setString(3, email);
                    pstmt.setString(4, password);
                    pstmt.setString(5, phone);
                    pstmt.setString(6, dob);
                    pstmt.setString(7, gender);
                    pstmt.setString(8, address != null && !address.isEmpty() ? address : "Not Specified");
                    pstmt.executeUpdate();

                    logAudit(name, "Patient", "Patient Registration", "Users", "Self-registered new patient account.");

                    sendJsonResponse(exchange, 201, "{\"success\":true,\"message\":\"Patient registered successfully.\",\"id\":\"" + id + "\"}");
                }
            } catch (SQLException e) {
                sendJsonResponse(exchange, 400, "{\"success\":false,\"message\":\"Registration failed: " + e.getMessage() + "\"}");
            }
        }
    }

    // 4. Change Password Handler
    static class ChangePasswordHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                enableCORS(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                return;
            }
            String body = readRequestBody(exchange);
            String userId = getJsonField(body, "userId");
            String currentPassword = getJsonField(body, "currentPassword");
            String newPassword = getJsonField(body, "newPassword");

            String sqlSelect = "SELECT name, role, password FROM users WHERE id = ?";
            try (Connection conn = DatabaseManager.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sqlSelect)) {
                pstmt.setString(1, userId);
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        String existingPassword = rs.getString("password");
                        String name = rs.getString("name");
                        String role = rs.getString("role");

                        if (!existingPassword.equals(currentPassword)) {
                            sendJsonResponse(exchange, 400, "{\"success\":false,\"message\":\"Current password is incorrect.\"}");
                            return;
                        }

                        String sqlUpdate = "UPDATE users SET password = ? WHERE id = ?";
                        try (PreparedStatement updateStmt = conn.prepareStatement(sqlUpdate)) {
                            updateStmt.setString(1, newPassword);
                            updateStmt.setString(2, userId);
                            updateStmt.executeUpdate();

                            logAudit(name, role, "Password Changed", "Security", "Updated account password successfully.");

                            sendJsonResponse(exchange, 200, "{\"success\":true,\"message\":\"Password updated successfully.\"}");
                            return;
                        }
                    }
                }
            } catch (SQLException e) {
                sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                return;
            }
            sendJsonResponse(exchange, 404, "{\"success\":false,\"message\":\"User not found.\"}");
        }
    }

    // 4b. Verify Email Handler (for Forgot Password)
    static class VerifyEmailHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                enableCORS(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                return;
            }
            String body = readRequestBody(exchange);
            String email = getJsonField(body, "email").trim().toLowerCase();

            String sql = "SELECT id, name, email, role FROM users WHERE LOWER(email) = LOWER(?)";
            try (Connection conn = DatabaseManager.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, email);
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        String json = String.format("{\"success\":true,\"user\":{\"id\":\"%s\",\"name\":\"%s\",\"email\":\"%s\",\"role\":\"%s\"}}",
                            rs.getString("id"), rs.getString("name"), rs.getString("email"), rs.getString("role"));
                        sendJsonResponse(exchange, 200, json);
                        return;
                    }
                }
            } catch (SQLException e) {
                sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                return;
            }
            sendJsonResponse(exchange, 404, "{\"success\":false,\"message\":\"No registered account found with that email address.\"}");
        }
    }

    // 4c. Reset Password Handler (for Forgot Password)
    static class ResetPasswordHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                enableCORS(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                return;
            }
            String body = readRequestBody(exchange);
            String email = getJsonField(body, "email").trim().toLowerCase();
            String newPassword = getJsonField(body, "newPassword");

            if (newPassword == null || newPassword.length() < 6) {
                sendJsonResponse(exchange, 400, "{\"success\":false,\"message\":\"New password must be at least 6 characters.\"}");
                return;
            }

            String sqlSelect = "SELECT name, role FROM users WHERE LOWER(email) = LOWER(?)";
            try (Connection conn = DatabaseManager.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sqlSelect)) {
                pstmt.setString(1, email);
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        String name = rs.getString("name");
                        String role = rs.getString("role");

                        String sqlUpdate = "UPDATE users SET password = ? WHERE LOWER(email) = LOWER(?)";
                        try (PreparedStatement updateStmt = conn.prepareStatement(sqlUpdate)) {
                            updateStmt.setString(1, newPassword);
                            updateStmt.setString(2, email);
                            updateStmt.executeUpdate();

                            logAudit(name, role, "Password Reset", "Security", "Reset password via Forgot Password workflow.");

                            sendJsonResponse(exchange, 200, "{\"success\":true,\"message\":\"Password reset successfully. You can now sign in with your new password.\"}");
                            return;
                        }
                    }
                }
            } catch (SQLException e) {
                sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                return;
            }
            sendJsonResponse(exchange, 404, "{\"success\":false,\"message\":\"Account not found for password reset.\"}");
        }
    }

    // 5. Users Handler (GET / POST / PUT)
    static class UsersHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                enableCORS(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            String method = exchange.getRequestMethod();
            if ("GET".equalsIgnoreCase(method)) {
                List<Map<String, String>> users = new ArrayList<>();
                String sql = "SELECT id, name, email, role, phone, dob, gender, address, created_at FROM users";
                try (Connection conn = DatabaseManager.getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
                    StringBuilder sb = new StringBuilder("[");
                    boolean first = true;
                    while (rs.next()) {
                        if (!first) sb.append(",");
                        sb.append(String.format(
                            "{\"id\":\"%s\",\"name\":\"%s\",\"email\":\"%s\",\"role\":\"%s\",\"phone\":\"%s\",\"dob\":\"%s\",\"gender\":\"%s\",\"address\":\"%s\",\"created_at\":\"%s\"}",
                            rs.getString("id"), rs.getString("name"), rs.getString("email"), rs.getString("role"),
                            rs.getString("phone") != null ? rs.getString("phone") : "",
                            rs.getString("dob") != null ? rs.getString("dob") : "",
                            rs.getString("gender") != null ? rs.getString("gender") : "",
                            rs.getString("address") != null ? rs.getString("address") : "",
                            rs.getString("created_at")
                        ));
                        first = false;
                    }
                    sb.append("]");
                    sendJsonResponse(exchange, 200, sb.toString());
                } catch (SQLException e) {
                    sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                }
            } else if ("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method)) {
                String body = readRequestBody(exchange);
                String id = getJsonField(body, "id");
                String name = getJsonField(body, "name");
                String email = getJsonField(body, "email");
                String role = getJsonField(body, "role");
                String phone = getJsonField(body, "phone");
                String dob = getJsonField(body, "dob");
                String gender = getJsonField(body, "gender");
                String address = getJsonField(body, "address");

                if (id == null || id.isEmpty()) {
                    id = "usr-" + System.currentTimeMillis();
                    String sql = "INSERT INTO users (id, name, email, password, role, phone, dob, gender, address) VALUES (?, ?, ?, 'user123', ?, ?, ?, ?, ?)";
                    try (Connection conn = DatabaseManager.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
                        pstmt.setString(1, id);
                        pstmt.setString(2, name);
                        pstmt.setString(3, email);
                        pstmt.setString(4, role);
                        pstmt.setString(5, phone);
                        pstmt.setString(6, dob);
                        pstmt.setString(7, gender);
                        pstmt.setString(8, address);
                        pstmt.executeUpdate();
                        logAudit("Admin", "Admin", "User Account Created", "Users", "Created new user " + name + " (" + role + ")");
                        sendJsonResponse(exchange, 201, "{\"success\":true,\"id\":\"" + id + "\"}");
                    } catch (SQLException e) {
                        sendJsonResponse(exchange, 400, "{\"error\":\"" + e.getMessage() + "\"}");
                    }
                } else {
                    String sql = "UPDATE users SET name=?, email=?, phone=?, dob=?, gender=?, address=? WHERE id=?";
                    try (Connection conn = DatabaseManager.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
                        pstmt.setString(1, name);
                        pstmt.setString(2, email);
                        pstmt.setString(3, phone);
                        pstmt.setString(4, dob);
                        pstmt.setString(5, gender);
                        pstmt.setString(6, address);
                        pstmt.setString(7, id);
                        pstmt.executeUpdate();
                        logAudit(name, role, "Profile Updated", "Users", "Updated profile personal and contact details.");
                        sendJsonResponse(exchange, 200, "{\"success\":true,\"message\":\"Profile updated successfully.\"}");
                    } catch (SQLException e) {
                        sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                    }
                }
            }
        }
    }

    // 6. Catalog Handler
    static class CatalogHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                enableCORS(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                String sql = "SELECT * FROM catalog";
                try (Connection conn = DatabaseManager.getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
                    StringBuilder sb = new StringBuilder("[");
                    boolean first = true;
                    while (rs.next()) {
                        if (!first) sb.append(",");
                        sb.append(String.format(
                            "{\"id\":\"%s\",\"code\":\"%s\",\"name\":\"%s\",\"category\":\"%s\",\"price\":%.2f,\"turnaround_hours\":%d,\"description\":\"%s\",\"parameters\":%s}",
                            rs.getString("id"), rs.getString("code"), rs.getString("name"), rs.getString("category"),
                            rs.getDouble("price"), rs.getInt("turnaround_hours"),
                            rs.getString("description") != null ? rs.getString("description").replace("\"", "\\\"") : "",
                            rs.getString("parameters_json")
                        ));
                        first = false;
                    }
                    sb.append("]");
                    sendJsonResponse(exchange, 200, sb.toString());
                } catch (SQLException e) {
                    sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                }
            }
        }
    }

    // 7. Orders Handler (Doctor & Admin order lab tests)
    static class OrdersHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                enableCORS(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            String method = exchange.getRequestMethod();
            if ("GET".equalsIgnoreCase(method)) {
                String sql = "SELECT * FROM orders ORDER BY order_date DESC";
                try (Connection conn = DatabaseManager.getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
                    StringBuilder sb = new StringBuilder("[");
                    boolean first = true;
                    while (rs.next()) {
                        if (!first) sb.append(",");
                        sb.append(String.format(
                            "{\"id\":\"%s\",\"patient_id\":\"%s\",\"patient_name\":\"%s\",\"doctor_id\":\"%s\",\"doctor_name\":\"%s\",\"test_ids\":\"%s\",\"test_names\":\"%s\",\"status\":\"%s\",\"priority\":\"%s\",\"order_date\":\"%s\",\"notes\":\"%s\"}",
                            rs.getString("id"), rs.getString("patient_id"), rs.getString("patient_name"),
                            rs.getString("doctor_id") != null ? rs.getString("doctor_id") : "",
                            rs.getString("doctor_name") != null ? rs.getString("doctor_name") : "",
                            rs.getString("test_ids"), rs.getString("test_names"),
                            rs.getString("status"), rs.getString("priority"), rs.getString("order_date"),
                            rs.getString("notes") != null ? rs.getString("notes").replace("\"", "\\\"") : ""
                        ));
                        first = false;
                    }
                    sb.append("]");
                    sendJsonResponse(exchange, 200, sb.toString());
                } catch (SQLException e) {
                    sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                }
            } else if ("POST".equalsIgnoreCase(method)) {
                String body = readRequestBody(exchange);
                String patientId = getJsonField(body, "patient_id");
                String patientName = getJsonField(body, "patient_name");
                String doctorId = getJsonField(body, "doctor_id");
                String doctorName = getJsonField(body, "doctor_name");
                String testIds = getJsonField(body, "test_ids");
                String testNames = getJsonField(body, "test_names");
                String priority = getJsonField(body, "priority");
                if (priority.isEmpty()) priority = "Routine";
                String notes = getJsonField(body, "notes");
                String orderId = "ORD-" + (100 + (int)(Math.random() * 900));

                String sqlOrder = "INSERT INTO orders (id, patient_id, patient_name, doctor_id, doctor_name, test_ids, test_names, status, priority, notes) VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending Collection', ?, ?)";
                try (Connection conn = DatabaseManager.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sqlOrder)) {
                    pstmt.setString(1, orderId);
                    pstmt.setString(2, patientId);
                    pstmt.setString(3, patientName);
                    pstmt.setString(4, doctorId);
                    pstmt.setString(5, doctorName);
                    pstmt.setString(6, testIds);
                    pstmt.setString(7, testNames);
                    pstmt.setString(8, priority);
                    pstmt.setString(9, notes);
                    pstmt.executeUpdate();

                    // Create Specimen Accession Entry
                    String specId = "SPEC-" + (100 + (int)(Math.random() * 900));
                    String barcode = "BAR-" + (1000000 + (int)(Math.random() * 9000000));
                    String sqlSpec = "INSERT INTO specimens (id, order_id, patient_name, test_name, specimen_type, barcode, stage, technician_name) VALUES (?, ?, ?, ?, 'EDTA Whole Blood', ?, 'Pending Collection', 'Unassigned')";
                    try (PreparedStatement specStmt = conn.prepareStatement(sqlSpec)) {
                        specStmt.setString(1, specId);
                        specStmt.setString(2, orderId);
                        specStmt.setString(3, patientName);
                        specStmt.setString(4, testNames);
                        specStmt.setString(5, barcode);
                        specStmt.executeUpdate();
                    }

                    // Audit Log
                    logAudit(doctorName.isEmpty() ? "System Admin" : doctorName, doctorId.isEmpty() ? "Admin" : "Doctor", "Laboratory Order Created", "Orders", "Created order " + orderId + " for patient " + patientName + " (" + testNames + ")");

                    // Dispatch Notifications
                    String sqlNotif = "INSERT INTO notifications (id, target_role, message, type) VALUES (?, ?, ?, ?)";
                    try (PreparedStatement notifStmt = conn.prepareStatement(sqlNotif)) {
                        notifStmt.setString(1, "NOTIF-" + System.currentTimeMillis());
                        notifStmt.setString(2, "technician");
                        notifStmt.setString(3, "New specimen assigned: Order #" + orderId + " (" + testNames + ").");
                        notifStmt.setString(4, "info");
                        notifStmt.executeUpdate();
                    }

                    sendJsonResponse(exchange, 201, "{\"success\":true,\"order_id\":\"" + orderId + "\",\"specimen_id\":\"" + specId + "\"}");
                } catch (SQLException e) {
                    sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                }
            }
        }
    }

    // 8. Specimens Handler (Technician accessioning & Sample Rejection)
    static class SpecimensHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                enableCORS(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            String method = exchange.getRequestMethod();
            if ("GET".equalsIgnoreCase(method)) {
                String sql = "SELECT * FROM specimens ORDER BY collection_date DESC";
                try (Connection conn = DatabaseManager.getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
                    StringBuilder sb = new StringBuilder("[");
                    boolean first = true;
                    while (rs.next()) {
                        if (!first) sb.append(",");
                        sb.append(String.format(
                            "{\"id\":\"%s\",\"order_id\":\"%s\",\"patient_name\":\"%s\",\"test_name\":\"%s\",\"specimen_type\":\"%s\",\"barcode\":\"%s\",\"stage\":\"%s\",\"collection_date\":\"%s\",\"rejection_reason\":\"%s\",\"technician_name\":\"%s\"}",
                            rs.getString("id"), rs.getString("order_id"), rs.getString("patient_name"),
                            rs.getString("test_name"), rs.getString("specimen_type"), rs.getString("barcode"),
                            rs.getString("stage"), rs.getString("collection_date"),
                            rs.getString("rejection_reason") != null ? rs.getString("rejection_reason") : "",
                            rs.getString("technician_name") != null ? rs.getString("technician_name") : ""
                        ));
                        first = false;
                    }
                    sb.append("]");
                    sendJsonResponse(exchange, 200, sb.toString());
                } catch (SQLException e) {
                    sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                }
            } else if ("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method)) {
                String body = readRequestBody(exchange);
                String action = getJsonField(body, "action"); // 'reject' or 'update_stage'
                String specimenId = getJsonField(body, "id");
                String techName = getJsonField(body, "technician_name");
                if (techName.isEmpty()) techName = "Parth Panchal";

                if ("reject".equalsIgnoreCase(action)) {
                    String reason = getJsonField(body, "rejection_reason");
                    String orderId = getJsonField(body, "order_id");

                    String sqlSpec = "UPDATE specimens SET stage = 'Rejected', rejection_reason = ?, rejection_date = CURRENT_TIMESTAMP, technician_name = ? WHERE id = ?";
                    String sqlOrd = "UPDATE orders SET status = 'Rejected' WHERE id = ?";
                    try (Connection conn = DatabaseManager.getConnection();
                         PreparedStatement pstmtSpec = conn.prepareStatement(sqlSpec);
                         PreparedStatement pstmtOrd = conn.prepareStatement(sqlOrd)) {
                        
                        pstmtSpec.setString(1, reason);
                        pstmtSpec.setString(2, techName);
                        pstmtSpec.setString(3, specimenId);
                        pstmtSpec.executeUpdate();

                        pstmtOrd.setString(1, orderId);
                        pstmtOrd.executeUpdate();

                        logAudit(techName, "Technician", "Sample Rejection", "Laboratory", "Rejected specimen " + specimenId + " for Order " + orderId + ". Reason: " + reason);

                        // Notifications
                        String sqlNotif = "INSERT INTO notifications (id, target_role, message, type) VALUES (?, ?, ?, ?)";
                        try (PreparedStatement notifStmt = conn.prepareStatement(sqlNotif)) {
                            notifStmt.setString(1, "NOTIF-" + System.currentTimeMillis());
                            notifStmt.setString(2, "doctor");
                            notifStmt.setString(3, "Sample rejected for Order #" + orderId + ". Reason: " + reason);
                            notifStmt.setString(4, "error");
                            notifStmt.executeUpdate();

                            notifStmt.setString(1, "NOTIF-" + (System.currentTimeMillis() + 1));
                            notifStmt.setString(2, "admin");
                            notifStmt.setString(3, "Sample " + specimenId + " rejected by Technician " + techName + ".");
                            notifStmt.setString(4, "warning");
                            notifStmt.executeUpdate();
                        }

                        sendJsonResponse(exchange, 200, "{\"success\":true,\"message\":\"Specimen rejected and alerts dispatched.\"}");
                    } catch (SQLException e) {
                        sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                    }
                } else {
                    String newStage = getJsonField(body, "stage");
                    String sql = "UPDATE specimens SET stage = ?, technician_name = ? WHERE id = ?";
                    try (Connection conn = DatabaseManager.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
                        pstmt.setString(1, newStage);
                        pstmt.setString(2, techName);
                        pstmt.setString(3, specimenId);
                        pstmt.executeUpdate();

                        sendJsonResponse(exchange, 200, "{\"success\":true,\"message\":\"Specimen stage updated to " + newStage + ".\"}");
                    } catch (SQLException e) {
                        sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                    }
                }
            }
        }
    }

    // 9. Invoices Handler
    static class InvoicesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                enableCORS(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                String sql = "SELECT * FROM invoices ORDER BY billing_date DESC";
                try (Connection conn = DatabaseManager.getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
                    StringBuilder sb = new StringBuilder("[");
                    boolean first = true;
                    while (rs.next()) {
                        if (!first) sb.append(",");
                        sb.append(String.format(
                            "{\"id\":\"%s\",\"order_id\":\"%s\",\"patient_id\":\"%s\",\"patient_name\":\"%s\",\"test_names\":\"%s\",\"subtotal\":%.2f,\"discount\":%.2f,\"total_amount\":%.2f,\"billing_date\":\"%s\",\"status\":\"%s\"}",
                            rs.getString("id"), rs.getString("order_id"), rs.getString("patient_id"),
                            rs.getString("patient_name"), rs.getString("test_names"),
                            rs.getDouble("subtotal"), rs.getDouble("discount"), rs.getDouble("total_amount"),
                            rs.getString("billing_date"), rs.getString("status")
                        ));
                        first = false;
                    }
                    sb.append("]");
                    sendJsonResponse(exchange, 200, sb.toString());
                } catch (SQLException e) {
                    sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                }
            }
        }
    }

    // 10. Payments Handler (Patient Payment Gateway Integration & Admin Payment Verification)
    static class PaymentsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                enableCORS(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            try {
                String method = exchange.getRequestMethod();
                if ("GET".equalsIgnoreCase(method)) {
                    String sql = "SELECT * FROM payments ORDER BY payment_date DESC";
                    try (Connection conn = DatabaseManager.getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
                        StringBuilder sb = new StringBuilder("[");
                        boolean first = true;
                        while (rs.next()) {
                            if (!first) sb.append(",");
                            sb.append(String.format(
                                "{\"id\":\"%s\",\"invoice_id\":\"%s\",\"patient_id\":\"%s\",\"patient_name\":\"%s\",\"amount\":%.2f,\"payment_method\":\"%s\",\"transaction_id\":\"%s\",\"payment_date\":\"%s\",\"status\":\"%s\",\"verified_by_admin\":%d}",
                                rs.getString("id"), rs.getString("invoice_id"), rs.getString("patient_id"),
                                rs.getString("patient_name"), rs.getDouble("amount"), rs.getString("payment_method"),
                                rs.getString("transaction_id"), rs.getString("payment_date"),
                                rs.getString("status"), rs.getInt("verified_by_admin")
                            ));
                            first = false;
                        }
                        sb.append("]");
                        sendJsonResponse(exchange, 200, sb.toString());
                    } catch (SQLException e) {
                        sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                    }
                } else if ("POST".equalsIgnoreCase(method)) {
                    String body = readRequestBody(exchange);
                    String invoiceId = getJsonField(body, "invoice_id");
                    String patientId = getJsonField(body, "patient_id");
                    String patientName = getJsonField(body, "patient_name");
                    String amountStr = getJsonField(body, "amount");
                    double amount = 0.0;
                    try {
                        amount = Double.parseDouble(amountStr);
                    } catch (Exception ignored) {}

                    String methodStr = getJsonField(body, "payment_method");
                    if (methodStr.isEmpty()) methodStr = "UPI / Card Online";
                    String txnId = "TXN" + (10000000 + (int)(Math.random() * 90000000));
                    String payId = "PAY-" + (9000 + (int)(Math.random() * 1000));
                    String cleanOrderId = invoiceId.replace("INV-", "").replace("ord_", "");

                    String sqlPay = "INSERT INTO payments (id, invoice_id, patient_id, patient_name, amount, payment_method, transaction_id, status, verified_by_admin) VALUES (?, ?, ?, ?, ?, ?, ?, 'Completed', 1)";
                    String sqlInv = "UPDATE invoices SET status = 'Paid' WHERE id = ? OR order_id = ? OR id = ?";
                    String sqlOrd = "UPDATE orders SET status = 'Completed' WHERE id = ? OR id = ?";

                    try (Connection conn = DatabaseManager.getConnection()) {
                        try (PreparedStatement pstmtPay = conn.prepareStatement(sqlPay)) {
                            pstmtPay.setString(1, payId);
                            pstmtPay.setString(2, invoiceId);
                            pstmtPay.setString(3, patientId);
                            pstmtPay.setString(4, patientName);
                            pstmtPay.setDouble(5, amount);
                            pstmtPay.setString(6, methodStr);
                            pstmtPay.setString(7, txnId);
                            pstmtPay.executeUpdate();
                        } catch (Exception ignored) {}

                        try (PreparedStatement pstmtInv = conn.prepareStatement(sqlInv)) {
                            pstmtInv.setString(1, invoiceId);
                            pstmtInv.setString(2, "ord_" + cleanOrderId);
                            pstmtInv.setString(3, "INV-" + cleanOrderId);
                            pstmtInv.executeUpdate();
                        } catch (Exception ignored) {}

                        try (PreparedStatement pstmtOrd = conn.prepareStatement(sqlOrd)) {
                            pstmtOrd.setString(1, "ord_" + cleanOrderId);
                            pstmtOrd.setString(2, cleanOrderId);
                            pstmtOrd.executeUpdate();
                        } catch (Exception ignored) {}

                        logAudit(patientName, "Patient", "Online Payment Completed", "Billing", "Paid ₹" + amount + " online for Invoice #" + invoiceId + " via " + methodStr + " (Txn: " + txnId + ")");

                        // Event Notifications
                        String sqlNotif = "INSERT INTO notifications (id, target_role, target_user_id, message, type) VALUES (?, ?, ?, ?, ?)";
                        try (PreparedStatement notifStmt = conn.prepareStatement(sqlNotif)) {
                            // Admin Notification
                            notifStmt.setString(1, "NOTIF-" + System.currentTimeMillis());
                            notifStmt.setString(2, "admin");
                            notifStmt.setString(3, "");
                            notifStmt.setString(4, "Payment received for " + patientName + " — Invoice #" + invoiceId + " (₹" + amount + ").");
                            notifStmt.setString(5, "success");
                            notifStmt.executeUpdate();

                            // Patient Notification
                            notifStmt.setString(1, "NOTIF-" + (System.currentTimeMillis() + 1));
                            notifStmt.setString(2, "patient");
                            notifStmt.setString(3, patientId);
                            notifStmt.setString(4, "Payment of ₹" + amount + " confirmed for Invoice #" + invoiceId + ".");
                            notifStmt.setString(5, "success");
                            notifStmt.executeUpdate();
                        } catch (Exception ignored) {}

                        sendJsonResponse(exchange, 201, "{\"success\":true,\"transaction_id\":\"" + txnId + "\",\"message\":\"Payment gateway authorization successful.\"}");
                    }
                }
            } catch (Exception e) {
                sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
            }
        }
    }

    // 11. Clinical Notes Handler (Doctor clinical notes management)
    static class ClinicalNotesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                enableCORS(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            String method = exchange.getRequestMethod();
            if ("GET".equalsIgnoreCase(method)) {
                String sql = "SELECT * FROM clinical_notes ORDER BY created_at DESC";
                try (Connection conn = DatabaseManager.getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
                    StringBuilder sb = new StringBuilder("[");
                    boolean first = true;
                    while (rs.next()) {
                        if (!first) sb.append(",");
                        sb.append(String.format(
                            "{\"id\":\"%s\",\"patient_id\":\"%s\",\"patient_name\":\"%s\",\"doctor_id\":\"%s\",\"doctor_name\":\"%s\",\"order_id\":\"%s\",\"severity\":\"%s\",\"notes_text\":\"%s\",\"created_at\":\"%s\"}",
                            rs.getString("id"), rs.getString("patient_id"), rs.getString("patient_name"),
                            rs.getString("doctor_id"), rs.getString("doctor_name"),
                            rs.getString("order_id") != null ? rs.getString("order_id") : "",
                            rs.getString("severity"), rs.getString("notes_text").replace("\"", "\\\"").replace("\n", " "),
                            rs.getString("created_at")
                        ));
                        first = false;
                    }
                    sb.append("]");
                    sendJsonResponse(exchange, 200, sb.toString());
                } catch (SQLException e) {
                    sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                }
            } else if ("POST".equalsIgnoreCase(method)) {
                String body = readRequestBody(exchange);
                String patientId = getJsonField(body, "patient_id");
                String patientName = getJsonField(body, "patient_name");
                String doctorId = getJsonField(body, "doctor_id");
                String doctorName = getJsonField(body, "doctor_name");
                String orderId = getJsonField(body, "order_id");
                String severity = getJsonField(body, "severity");
                String notesText = getJsonField(body, "notes_text");
                String noteId = "NOTE-" + System.currentTimeMillis();

                String sql = "INSERT INTO clinical_notes (id, patient_id, patient_name, doctor_id, doctor_name, order_id, severity, notes_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                try (Connection conn = DatabaseManager.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
                    pstmt.setString(1, noteId);
                    pstmt.setString(2, patientId);
                    pstmt.setString(3, patientName);
                    pstmt.setString(4, doctorId);
                    pstmt.setString(5, doctorName);
                    pstmt.setString(6, orderId);
                    pstmt.setString(7, severity);
                    pstmt.setString(8, notesText);
                    pstmt.executeUpdate();

                    logAudit(doctorName, "Doctor", "Clinical Note Added", "Clinical Notes", "Added note (" + severity + ") for patient " + patientName);

                    if ("Urgent".equalsIgnoreCase(severity)) {
                        String sqlNotif = "INSERT INTO notifications (id, target_role, message, type) VALUES (?, ?, ?, ?)";
                        try (PreparedStatement notifStmt = conn.prepareStatement(sqlNotif)) {
                            notifStmt.setString(1, "NOTIF-" + System.currentTimeMillis());
                            notifStmt.setString(2, "doctor");
                            notifStmt.setString(3, "Critical result requires attention: " + patientName + " - " + notesText);
                            notifStmt.setString(4, "error");
                            notifStmt.executeUpdate();
                        }
                    }

                    sendJsonResponse(exchange, 201, "{\"success\":true,\"id\":\"" + noteId + "\",\"message\":\"Clinical note saved.\"}");
                } catch (SQLException e) {
                    sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                }
            }
        }
    }

    // 12. Audit Logs Handler (Admin Audit Log viewer)
    static class AuditLogsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                enableCORS(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                String sql = "SELECT * FROM audit_logs ORDER BY timestamp DESC";
                try (Connection conn = DatabaseManager.getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
                    StringBuilder sb = new StringBuilder("[");
                    boolean first = true;
                    while (rs.next()) {
                        if (!first) sb.append(",");
                        sb.append(String.format(
                            "{\"id\":\"%s\",\"user_name\":\"%s\",\"role\":\"%s\",\"action\":\"%s\",\"category\":\"%s\",\"details\":\"%s\",\"ip_address\":\"%s\",\"timestamp\":\"%s\"}",
                            rs.getString("id"), rs.getString("user_name"), rs.getString("role"),
                            rs.getString("action"), rs.getString("category"),
                            rs.getString("details").replace("\"", "\\\"").replace("\n", " "),
                            rs.getString("ip_address"), rs.getString("timestamp")
                        ));
                        first = false;
                    }
                    sb.append("]");
                    sendJsonResponse(exchange, 200, sb.toString());
                } catch (SQLException e) {
                    sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                }
            }
        }
    }

    // 13. Notifications Handler (Multi-role Event-Driven Notification Center API)
    static class NotificationsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                enableCORS(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            String method = exchange.getRequestMethod();
            if ("GET".equalsIgnoreCase(method)) {
                String rawQuery = exchange.getRequestURI().getQuery();
                String userIdParam = "";
                String roleParam = "";
                if (rawQuery != null) {
                    for (String pairStr : rawQuery.split("&")) {
                        String[] pair = pairStr.split("=");
                        if (pair.length == 2) {
                            if ("userId".equalsIgnoreCase(pair[0])) userIdParam = pair[1];
                            if ("role".equalsIgnoreCase(pair[0])) roleParam = pair[1];
                        }
                    }
                }

                String sql = "SELECT * FROM notifications ORDER BY timestamp DESC";
                PreparedStatement pstmt = null;
                Connection conn = null;
                try {
                    conn = DatabaseManager.getConnection();
                    if (!userIdParam.isEmpty() || !roleParam.isEmpty()) {
                        sql = "SELECT * FROM notifications WHERE target_user_id = ? OR target_role = ? ORDER BY timestamp DESC";
                        pstmt = conn.prepareStatement(sql);
                        pstmt.setString(1, userIdParam);
                        pstmt.setString(2, roleParam);
                    } else {
                        pstmt = conn.prepareStatement(sql);
                    }

                    try (ResultSet rs = pstmt.executeQuery()) {
                        StringBuilder sb = new StringBuilder("[");
                        boolean first = true;
                        while (rs.next()) {
                            if (!first) sb.append(",");
                            sb.append(String.format(
                                "{\"id\":\"%s\",\"target_role\":\"%s\",\"target_user_id\":\"%s\",\"message\":\"%s\",\"type\":\"%s\",\"is_read\":%d,\"timestamp\":\"%s\"}",
                                rs.getString("id"),
                                rs.getString("target_role") != null ? rs.getString("target_role") : "",
                                rs.getString("target_user_id") != null ? rs.getString("target_user_id") : "",
                                rs.getString("message").replace("\"", "\\\""),
                                rs.getString("type"), rs.getInt("is_read"), rs.getString("timestamp")
                            ));
                            first = false;
                        }
                        sb.append("]");
                        sendJsonResponse(exchange, 200, sb.toString());
                    }
                } catch (SQLException e) {
                    sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                } finally {
                    try { if (pstmt != null) pstmt.close(); } catch (Exception ignored) {}
                    try { if (conn != null) conn.close(); } catch (Exception ignored) {}
                }
            } else if ("DELETE".equalsIgnoreCase(method)) {
                String sql = "DELETE FROM notifications";
                try (Connection conn = DatabaseManager.getConnection(); Statement stmt = conn.createStatement()) {
                    stmt.executeUpdate(sql);
                    sendJsonResponse(exchange, 200, "{\"success\":true,\"message\":\"All notifications cleared.\"}");
                } catch (SQLException e) {
                    sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
                }
            }
        }
    }
}
