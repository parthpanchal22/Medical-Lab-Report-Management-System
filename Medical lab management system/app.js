/* ==========================================================================
   APEX CLINICAL LABS - CLINICAL APPLICATION CONTROLLER (LIGHT THEME DESIGNS)
   ========================================================================== */

// 1. DEFAULT CLINICAL SEED DATA
const DEFAULT_TEST_CATALOG = [
  {
    id: "cat_cbc",
    name: "Complete Blood Count (CBC)",
    code: "CBC",
    dept: "Hematology",
    price: 450,
    time: 12,
    desc: "Provides detailed metrics on red cells, white cells, and platelets. Essential for screening anemia and infectious processes.",
    parameters: [
      { name: "Hemoglobin (Hb)", unit: "g/dL", min: 12.0, max: 17.5 },
      { name: "White Blood Cells (WBC)", unit: "10^3/µL", min: 4.0, max: 11.0 },
      { name: "Red Blood Cells (RBC)", unit: "10^6/µL", min: 4.0, max: 5.9 },
      { name: "Platelet Count", unit: "10^3/µL", min: 150, max: 450 }
    ]
  },
  {
    id: "cat_lipid",
    name: "Lipid Profile",
    code: "LPD",
    dept: "Biochemistry",
    price: 850,
    time: 24,
    desc: "Evaluates total cholesterol, HDL, LDL, and triglyceride fractions to gauge cardiovascular risk.",
    parameters: [
      { name: "Total Cholesterol", unit: "mg/dL", min: 100, max: 200 },
      { name: "HDL Cholesterol", unit: "mg/dL", min: 40, max: 60 },
      { name: "LDL Cholesterol", unit: "mg/dL", min: 50, max: 130 },
      { name: "Triglycerides", unit: "mg/dL", min: 50, max: 150 }
    ]
  },
  {
    id: "cat_sugar",
    name: "Fasting Blood Sugar (FBS)",
    code: "FBS",
    dept: "Biochemistry",
    price: 150,
    time: 6,
    desc: "Measures plasma glucose levels after fasting to screen for hyperglycemia, prediabetes, or diabetes.",
    parameters: [
      { name: "Fasting Glucose", unit: "mg/dL", min: 70, max: 100 }
    ]
  },
  {
    id: "cat_thyroid",
    name: "Thyroid Panel (T3, T4, TSH)",
    code: "THY",
    dept: "Endocrinology",
    price: 600,
    time: 24,
    desc: "Measures circulating thyroid hormones and thyroid stimulating hormone to assess endocrine metabolism.",
    parameters: [
      { name: "Total T3", unit: "ng/mL", min: 0.8, max: 2.0 },
      { name: "Total T4", unit: "µg/dL", min: 5.0, max: 12.0 },
      { name: "TSH", unit: "µIU/mL", min: 0.4, max: 4.5 }
    ]
  },
  {
    id: "cat_lft",
    name: "Liver Function Test (LFT)",
    code: "LFT",
    dept: "Biochemistry",
    price: 750,
    time: 18,
    desc: "Assesses hepatic enzymes and proteins to monitor liver health and diagnose potential biliary clearance issues.",
    parameters: [
      { name: "Bilirubin Total", unit: "mg/dL", min: 0.2, max: 1.2 },
      { name: "SGOT (AST)", unit: "U/L", min: 5, max: 40 },
      { name: "SGPT (ALT)", unit: "U/L", min: 5, max: 35 },
      { name: "Alkaline Phosphatase", unit: "U/L", min: 30, max: 120 }
    ]
  }
];

const DEFAULT_USERS = [
  { id: "usr_admin", name: "Tanish Patel", email: "admin@lab.com", phone: "9876543001", dob: "1995-04-12", gender: "Male", role: "admin", password: "admin123", joined: "2026-01-10" },
  { id: "usr_tech", name: "Parth Panchal", email: "tech@lab.com", phone: "9876543002", dob: "1998-09-24", gender: "Male", role: "technician", password: "tech123", joined: "2026-02-15" },
  { id: "usr_doc1", name: "Dr. Zainab Khilji", email: "doctor@lab.com", phone: "9876543003", dob: "1989-11-05", gender: "Female", role: "doctor", password: "doctor123", joined: "2026-03-01" },
  { id: "usr_doc2", name: "Dr. Kabir Mehta", email: "kabir@lab.com", phone: "9876543004", dob: "1985-07-22", gender: "Male", role: "doctor", password: "doctor123", joined: "2026-03-12" },
  { id: "usr_pat1", name: "Rashi Pandya", email: "patient@lab.com", phone: "9876543005", dob: "2002-05-18", gender: "Female", role: "patient", password: "patient123", joined: "2026-04-05" },
  { id: "usr_pat2", name: "Aarav Sharma", email: "aarav@example.com", phone: "9988776655", dob: "1990-10-30", gender: "Male", role: "patient", password: "patient123", joined: "2026-05-20" },
  { id: "usr_pat3", name: "Priya Iyer", email: "priya@example.com", phone: "9123456789", dob: "1997-03-14", gender: "Female", role: "patient", password: "patient123", joined: "2026-06-02" }
];

const DEFAULT_ORDERS = [
  {
    id: "ord_101",
    patientId: "usr_pat1",
    patientName: "Rashi Pandya",
    tests: ["cat_cbc", "cat_sugar"],
    subtotal: 600,
    discount: 60,
    total: 540,
    date: "2026-07-15",
    status: "Completed",
    results: {
      "Hemoglobin (Hb)": 14.2,
      "White Blood Cells (WBC)": 7.4,
      "Red Blood Cells (RBC)": 4.8,
      "Platelet Count": 280,
      "Fasting Glucose": 92
    },
    technicianId: "usr_tech",
    certifiedDate: "2026-07-15",
    doctorNotes: {
      doctorId: "usr_doc1",
      doctorName: "Dr. Zainab Khilji",
      severity: "Normal",
      text: "All clinical observation markers are within target biological reference intervals. Maintain standard wellness guidelines."
    }
  },
  {
    id: "ord_102",
    patientId: "usr_pat2",
    patientName: "Aarav Sharma",
    tests: ["cat_lipid", "cat_lft"],
    subtotal: 1600,
    discount: 160,
    total: 1440,
    date: "2026-07-16",
    status: "Completed",
    results: {
      "Total Cholesterol": 225,
      "HDL Cholesterol": 42,
      "LDL Cholesterol": 148,
      "Triglycerides": 170,
      "Bilirubin Total": 0.8,
      "SGOT (AST)": 38,
      "SGPT (ALT)": 32,
      "Alkaline Phosphatase": 95
    },
    technicianId: "usr_tech",
    certifiedDate: "2026-07-16",
    doctorNotes: {
      doctorId: "usr_doc2",
      doctorName: "Dr. Kabir Mehta",
      severity: "Medium",
      text: "Total cholesterol and Bad LDL cholesterol levels are elevated. Advise a low-fat diet and recheck profile bounds in 6 weeks."
    }
  },
  {
    id: "ord_103",
    patientId: "usr_pat3",
    patientName: "Priya Iyer",
    tests: ["cat_thyroid"],
    subtotal: 600,
    discount: 60,
    total: 540,
    date: "2026-07-17",
    status: "Processing",
    results: null,
    technicianId: null,
    certifiedDate: null,
    doctorNotes: null
  },
  {
    id: "ord_104",
    patientId: "usr_pat1",
    patientName: "Rashi Pandya",
    tests: ["cat_lipid"],
    subtotal: 850,
    discount: 85,
    total: 765,
    date: "2026-07-18",
    status: "Collected",
    results: null,
    technicianId: null,
    certifiedDate: null,
    doctorNotes: null
  }
];

const DEFAULT_NOTIFICATIONS = [
  { id: "not_1", userId: "usr_pat1", text: "Laboratory results for Order #ord_101 have been certified.", date: "2026-07-15 14:30" },
  { id: "not_2", userId: "usr_pat1", text: "Dr. Zainab Khilji added clinical comments to your certified report #ord_101.", date: "2026-07-15 16:15" },
  { id: "not_3", userId: "usr_pat2", text: "Laboratory results for Order #ord_102 have been certified.", date: "2026-07-16 11:20" },
  { id: "not_4", userId: "usr_pat3", text: "Specimen accessioned and routed to diagnostic desks for Order #ord_103.", date: "2026-07-17 09:45" },
  { id: "not_5", userId: "usr_pat1", text: "Invoice generated successfully. Specimen collection logged.", date: "2026-07-18 10:00" }
];

// 2. STATE MANAGER (LOCAL STORAGE INTEGRATION)
class StateManager {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem("apexlabs_catalog")) {
      localStorage.setItem("apexlabs_catalog", JSON.stringify(DEFAULT_TEST_CATALOG));
    }
    if (!localStorage.getItem("apexlabs_users")) {
      localStorage.setItem("apexlabs_users", JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem("apexlabs_orders")) {
      localStorage.setItem("apexlabs_orders", JSON.stringify(DEFAULT_ORDERS));
    }
    if (!localStorage.getItem("apexlabs_notifications")) {
      localStorage.setItem("apexlabs_notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
    }
    
    // In-Memory Copy
    this.catalog = JSON.parse(localStorage.getItem("apexlabs_catalog"));
    this.users = JSON.parse(localStorage.getItem("apexlabs_users"));
    this.orders = JSON.parse(localStorage.getItem("apexlabs_orders"));
    this.notifications = JSON.parse(localStorage.getItem("apexlabs_notifications"));
    this.currentUser = JSON.parse(sessionStorage.getItem("apexlabs_current_user")) || null;
  }

  save() {
    localStorage.setItem("apexlabs_catalog", JSON.stringify(this.catalog));
    localStorage.setItem("apexlabs_users", JSON.stringify(this.users));
    localStorage.setItem("apexlabs_orders", JSON.stringify(this.orders));
    localStorage.setItem("apexlabs_notifications", JSON.stringify(this.notifications));
    if (this.currentUser) {
      sessionStorage.setItem("apexlabs_current_user", JSON.stringify(this.currentUser));
    } else {
      sessionStorage.removeItem("apexlabs_current_user");
    }
  }

  addNotification(userId, text) {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newNotif = {
      id: "not_" + Date.now(),
      userId: userId,
      text: text,
      date: timeStr
    };
    this.notifications.unshift(newNotif);
    this.save();
    // Render immediately if we are the user receiving it
    if (this.currentUser && this.currentUser.id === userId) {
      renderNotifications();
    }
  }
}

const LabState = new StateManager();

// 3. SPA ROUTING ENGINE
let currentActiveView = "auth";
let currentDashboardSubview = "";

function navigateTo(viewName) {
  currentActiveView = viewName;
  
  // Show/Hide views
  document.getElementById("view-auth").classList.remove("active");
  document.getElementById("view-dashboard").classList.remove("active");
  
  if (viewName === "auth") {
    document.getElementById("view-auth").classList.add("active");
  } else if (viewName === "dashboard") {
    document.getElementById("view-dashboard").classList.add("active");
    setupSidebarMenu();
    // Direct user to default dashboard tab based on role
    const defaultTabs = {
      patient: "patient-dashboard",
      technician: "tech-samples",
      doctor: "doctor-records",
      admin: "admin-dashboard"
    };
    switchDashboardSubview(defaultTabs[LabState.currentUser.role]);
    updateUserInfoWidgets();
  }
}

function switchDashboardSubview(subviewId) {
  currentDashboardSubview = subviewId;
  
  // Update nav link active state
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("data-target") === subviewId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Hide all panels and subviews
  document.querySelectorAll(".role-panel").forEach(p => p.classList.add("hide"));
  document.querySelectorAll(".subview").forEach(s => s.classList.remove("active"));
  
  // Show appropriate role container and subview
  if (subviewId.startsWith("admin-")) {
    document.getElementById("panel-admin").classList.add("active");
    document.getElementById("panel-admin").classList.remove("hide");
    document.getElementById(`subview-${subviewId}`).classList.add("active");
    
    // Refresh Subview Data
    if (subviewId === "admin-dashboard") renderAdminDashboardCharts();
    else if (subviewId === "admin-billing") renderBillingDeskTable();
    else if (subviewId === "admin-catalog") renderTestCatalogGrid();
    else if (subviewId === "admin-users") renderUsersTable();
    else if (subviewId === "admin-audit") renderAuditLogs();
  } 
  else if (subviewId.startsWith("tech-")) {
    document.getElementById("panel-technician").classList.add("active");
    document.getElementById("panel-technician").classList.remove("hide");
    document.getElementById(`subview-${subviewId}`).classList.add("active");
    
    if (subviewId === "tech-samples") renderSamplesQueueTable();
  } 
  else if (subviewId.startsWith("doctor-")) {
    document.getElementById("panel-doctor").classList.add("active");
    document.getElementById("panel-doctor").classList.remove("hide");
    document.getElementById(`subview-${subviewId}`).classList.add("active");
    
    if (subviewId === "doctor-records") renderDoctorPatientDirectoryTable();
    else if (subviewId === "doctor-notes") renderDoctorNotesTable();
  } 
  else if (subviewId.startsWith("patient-")) {
    document.getElementById("panel-patient").classList.add("active");
    document.getElementById("panel-patient").classList.remove("hide");
    document.getElementById(`subview-${subviewId}`).classList.add("active");
    
    if (subviewId === "patient-dashboard") renderPatientDashboard();
    else if (subviewId === "patient-reports") renderPatientReportsTable();
    else if (subviewId === "patient-profile") renderPatientProfile();
    else if (subviewId === "patient-billing") renderPatientBillingTable();
  }
  
  // Clear search field on subview switch
  document.getElementById("global-search").value = "";
}

function setupSidebarMenu() {
  const list = document.getElementById("sidebar-menu-list");
  list.innerHTML = "";
  const role = LabState.currentUser.role;
  
  const menuConfig = {
    patient: [
      { id: "patient-dashboard", label: "Health Portal", icon: "fa-solid fa-heart-pulse" },
      { id: "patient-billing", label: "Payment Gateway", icon: "fa-solid fa-credit-card" },
      { id: "patient-reports", label: "Report History", icon: "fa-solid fa-file-invoice" },
      { id: "patient-profile", label: "My Profile", icon: "fa-solid fa-user-gear" }
    ],
    technician: [
      { id: "tech-samples", label: "Specimen Accessioning", icon: "fa-solid fa-vial-virus" }
    ],
    doctor: [
      { id: "doctor-records", label: "Patient Directory", icon: "fa-solid fa-house-medical" },
      { id: "doctor-notes", label: "Clinical Notes", icon: "fa-solid fa-notes-medical" }
    ],
    admin: [
      { id: "admin-dashboard", label: "Operations Control", icon: "fa-solid fa-chart-line" },
      { id: "admin-billing", label: "Billing Desk", icon: "fa-solid fa-receipt" },
      { id: "admin-catalog", label: "Test Catalog", icon: "fa-solid fa-folder-open" },
      { id: "admin-users", label: "Manage Roles", icon: "fa-solid fa-users-gear" },
      { id: "admin-audit", label: "Audit Log", icon: "fa-solid fa-shield-halved" }
    ]
  };

  menuConfig[role].forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="nav-link" data-target="${item.id}" onclick="switchDashboardSubview('${item.id}')">
        <i class="${item.icon}"></i> <span>${item.label}</span>
      </button>
    `;
    list.appendChild(li);
  });
}

function updateUserInfoWidgets() {
  const roleLabels = {
    patient: "Patient Record",
    technician: "Laboratory Technician",
    doctor: "Consulting Physician",
    admin: "LIMS Administrator"
  };
  
  document.getElementById("user-role-label").innerText = roleLabels[LabState.currentUser.role];
  document.getElementById("sidebar-user-name").innerText = LabState.currentUser.name;
  document.getElementById("sidebar-user-email").innerText = LabState.currentUser.email;
  
  // Set avatar letter
  document.getElementById("user-avatar").innerText = LabState.currentUser.name.charAt(0);
  
  // Set header badge
  document.getElementById("header-user-role").innerText = LabState.currentUser.role.toUpperCase();
  
  renderNotifications();
}

// 4. THEME CONTROLLER (LIGHT/DARK)
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  
  const icon = document.getElementById("theme-toggle-icon");
  if (newTheme === "light") {
    icon.className = "fa-solid fa-sun";
  } else {
    icon.className = "fa-solid fa-moon";
  }
  
  // Dynamic Chart Sync: Update chart colors if admin dashboard chart is active
  if (currentActiveView === "dashboard" && currentDashboardSubview === "admin-dashboard") {
    renderAdminDashboardCharts();
  }
}

// 5. NOTIFICATIONS CONTROLLER
function toggleNotifications() {
  const panel = document.getElementById("notifications-panel");
  panel.classList.toggle("hide");
}

async function renderNotifications() {
  const countBadge = document.getElementById("notif-count");
  const list = document.getElementById("notification-list");
  if (!list || !countBadge) return;
  list.innerHTML = "";
  
  if (!LabState.currentUser) return;
  const user = LabState.currentUser;
  
  // Fetch real event-driven notifications from SQLite REST API
  let apiNotifs = await apiFetch(`/notifications?userId=${user.id}&role=${user.role}`);
  
  let userNotifs = [];
  if (apiNotifs && Array.isArray(apiNotifs)) {
    userNotifs = apiNotifs.filter(n => {
      if (n.target_user_id && n.target_user_id === user.id) return true;
      if (n.target_role && n.target_role.toLowerCase() === user.role.toLowerCase()) return true;
      return false;
    });
  }
  
  countBadge.innerText = userNotifs.length;
  
  if (userNotifs.length === 0) {
    list.innerHTML = `<li class="empty-notif" style="padding:15px; text-align:center; color:var(--text-muted); font-size:13px;">No new event notifications</li>`;
    return;
  }
  
  userNotifs.forEach(n => {
    const li = document.createElement("li");
    li.style.padding = "10px 12px";
    li.style.borderBottom = "1px solid var(--border-color)";
    li.style.fontSize = "13px";
    
    const iconMap = {
      success: '<i class="fa-solid fa-circle-check" style="color:var(--success);"></i>',
      warning: '<i class="fa-solid fa-triangle-exclamation" style="color:var(--warning);"></i>',
      danger: '<i class="fa-solid fa-circle-exclamation" style="color:var(--danger);"></i>',
      error: '<i class="fa-solid fa-circle-exclamation" style="color:var(--danger);"></i>',
      info: '<i class="fa-solid fa-circle-info" style="color:var(--accent);"></i>'
    };
    li.innerHTML = `
      <div style="display:flex; gap:10px; align-items:flex-start;">
        ${iconMap[n.type] || iconMap.info}
        <div>
          <div style="font-weight:500; color:var(--text-primary); margin-bottom:2px;">${n.message}</div>
          <div style="font-size:11px; color:var(--text-muted);">${n.timestamp || 'Recent Event'}</div>
        </div>
      </div>
    `;
    list.appendChild(li);
  });
}

async function clearNotifications() {
  await apiFetch("/notifications", { method: "DELETE" });
  LabState.notifications = [];
  LabState.save();
  renderNotifications();
}

// Close dropdown on click outside
window.addEventListener("click", (e) => {
  const panel = document.getElementById("notifications-panel");
  const bell = document.querySelector(".notification-dropdown-wrapper button");
  if (panel && !panel.classList.contains("hide") && !panel.contains(e.target) && !bell.contains(e.target)) {
    panel.classList.add("hide");
  }
});

// 6. AUTHENTICATION OPERATIONS
function switchAuthTab(tab) {
  document.getElementById("btn-tab-login").classList.remove("active");
  document.getElementById("btn-tab-register").classList.remove("active");
  document.getElementById("form-login").classList.remove("active");
  document.getElementById("form-register").classList.remove("active");
  
  if (tab === 'login') {
    document.getElementById("btn-tab-login").classList.add("active");
    document.getElementById("form-login").classList.add("active");
  } else {
    document.getElementById("btn-tab-register").classList.add("active");
    document.getElementById("form-register").classList.add("active");
  }
}

function autofillCreds(email, password, role) {
  document.getElementById("login-email").value = email;
  document.getElementById("login-password").value = password;
  document.querySelector(`input[name="login-role"][value="${role}"]`).checked = true;
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const pass = document.getElementById("login-password").value;
  const role = document.querySelector('input[name="login-role"]:checked').value;
  
  // Call Java REST Backend Authentication API
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password: pass, role })
  });
  
  if (res && res.user) {
    LabState.currentUser = res.user;
    LabState.save();
    await syncWithBackend();
    navigateTo("dashboard");
    return;
  }
  
  // Fallback for demo local state if backend is offline
  const foundUser = LabState.users.find(u => u.email.toLowerCase() === email && u.role === role);
  
  if (!foundUser) {
    alert((res && res.message) ? res.message : "No accounts matching that email and role found.");
    return;
  }
  
  if (foundUser.password !== pass) {
    alert("Incorrect password. Please try again.");
    return;
  }
  
  // Save session
  LabState.currentUser = foundUser;
  LabState.save();
  await syncWithBackend();
  
  // Transition View
  navigateTo("dashboard");
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim().toLowerCase();
  const phone = document.getElementById("reg-phone").value.trim();
  const dob = document.getElementById("reg-dob").value;
  const gender = document.getElementById("reg-gender").value;
  const pass = document.getElementById("reg-password").value;
  
  // Call Java REST Backend Registration API (Saves directly to SQLite users table)
  const res = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, phone, dob, gender, password: pass })
  });
  
  if (res && res.success) {
    const newUser = {
      id: res.id || ("usr_pat_" + Date.now()),
      name: name,
      email: email,
      phone: phone,
      dob: dob,
      gender: gender,
      role: "patient",
      password: pass,
      joined: new Date().toISOString().substring(0, 10)
    };
    
    LabState.users.push(newUser);
    LabState.save();
    
    alert("Registration successful! Your account has been saved to SQLite. You can now sign in.");
    switchAuthTab('login');
    autofillCreds(email, pass, 'patient');
  } else {
    const msg = (res && res.message) ? res.message : "An account with this email address already exists.";
    alert(msg);
  }
}

// --- FORGOT PASSWORD WORKFLOW ---
function openForgotPasswordModal() {
  document.getElementById("form-forgot-step1").reset();
  document.getElementById("form-forgot-step2").reset();
  document.getElementById("form-forgot-step1").classList.remove("hide");
  document.getElementById("form-forgot-step2").classList.add("hide");
  document.getElementById("modal-forgot-password").classList.remove("hide");
}

function closeForgotPasswordModal() {
  document.getElementById("modal-forgot-password").classList.add("hide");
}

async function handleVerifyEmailForReset(e) {
  e.preventDefault();
  const email = document.getElementById("forgot-email").value.trim().toLowerCase();
  
  const res = await apiFetch("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ email })
  });
  
  if (res && res.success && res.user) {
    document.getElementById("forgot-verified-name").innerText = res.user.name;
    document.getElementById("forgot-verified-email").innerText = res.user.email;
    document.getElementById("form-forgot-step1").classList.add("hide");
    document.getElementById("form-forgot-step2").classList.remove("hide");
  } else {
    const msg = (res && res.message) ? res.message : "No registered account found with that email address.";
    alert(msg);
  }
}

async function handleResetPasswordSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("forgot-verified-email").innerText.trim().toLowerCase();
  const newPwd = document.getElementById("forgot-new-password").value;
  const confirmPwd = document.getElementById("forgot-confirm-password").value;
  
  if (newPwd !== confirmPwd) {
    alert("New password and confirmation do not match.");
    return;
  }
  
  const res = await apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, newPassword: newPwd })
  });
  
  if (res && res.success) {
    // Update local state if user is present
    const localUser = LabState.users.find(u => u.email.toLowerCase() === email);
    if (localUser) {
      localUser.password = newPwd;
      LabState.save();
    }
    closeForgotPasswordModal();
    alert("Password reset successfully in SQLite! You can now log in with your new password.");
    document.getElementById("login-email").value = email;
    document.getElementById("login-password").value = newPwd;
  } else {
    alert((res && res.message) ? res.message : "Password reset failed. Please try again.");
  }
}

function handleLogout() {
  LabState.currentUser = null;
  sessionStorage.removeItem("apexlabs_current_user");
  
  // Reset forms
  document.getElementById("form-login").reset();
  document.getElementById("form-register").reset();
  
  navigateTo("auth");
}

// 7. COMMON PAGINATION ENGINE
const PAGE_SIZE = 5;
let paginationState = {
  billing: 1,
  users: 1,
  samples: 1,
  doctorPatients: 1,
  patientReports: 1
};

function getPaginatedData(data, pageNum, size = PAGE_SIZE) {
  const start = (pageNum - 1) * size;
  const end = start + size;
  return {
    items: data.slice(start, end),
    totalPages: Math.ceil(data.length / size),
    totalItems: data.length
  };
}

function renderPaginationControls(containerId, totalPages, currentPage, stateKey, changeCallback) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = "";
  if (totalPages <= 1) return;
  
  // Previous Button
  const prevBtn = document.createElement("button");
  prevBtn.className = "pagination-btn";
  prevBtn.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    paginationState[stateKey]--;
    changeCallback();
  };
  container.appendChild(prevBtn);
  
  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = `pagination-btn ${currentPage === i ? 'active' : ''}`;
    pageBtn.innerText = i;
    pageBtn.onclick = () => {
      paginationState[stateKey] = i;
      changeCallback();
    };
    container.appendChild(pageBtn);
  }
  
  // Next Button
  const nextBtn = document.createElement("button");
  nextBtn.className = "pagination-btn";
  nextBtn.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    paginationState[stateKey]++;
    changeCallback();
  };
  container.appendChild(nextBtn);
}

// 8. ADMIN PORTAL CONTROLLER

// Render Charts (Revenue and Test Counts)
let revenueChartInstance = null;
let categoryChartInstance = null;

function renderAdminDashboardCharts() {
  // Update Analytics Cards Metrics
  const orders = LabState.orders;
  const patientsCount = LabState.users.filter(u => u.role === "patient").length;
  
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter(o => o.status !== "Completed").length;
  const completedCount = orders.filter(o => o.status === "Completed").length;
  
  document.getElementById("stat-admin-revenue").innerText = `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  document.getElementById("stat-admin-patients").innerText = patientsCount;
  document.getElementById("stat-admin-samples").innerText = pendingCount;
  document.getElementById("stat-admin-completed").innerText = completedCount;
  
  // Prepare data for Revenue Chart (Total per order date)
  const revenueByDate = {};
  const volumesByCategory = { Hematology: 0, Biochemistry: 0, Endocrinology: 0 };
  
  orders.forEach(o => {
    // Revenue sum
    revenueByDate[o.date] = (revenueByDate[o.date] || 0) + o.total;
    // Count catalog category mappings
    o.tests.forEach(testId => {
      const test = LabState.catalog.find(c => c.id === testId);
      if (test && volumesByCategory[test.dept] !== undefined) {
        volumesByCategory[test.dept]++;
      }
    });
  });
  
  const dates = Object.keys(revenueByDate).sort();
  const revenues = dates.map(d => revenueByDate[d]);
  
  // Build Chart.js widgets (Polished matching Natural teal/slate theme)
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const labelColor = isDark ? '#9ca3af' : '#475569';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9';
  
  // Destruct existing instances to re-render
  if (revenueChartInstance) revenueChartInstance.destroy();
  if (categoryChartInstance) categoryChartInstance.destroy();
  
  const revCtx = document.getElementById("revenueChart").getContext("2d");
  revenueChartInstance = new Chart(revCtx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Daily Revenue (₹)',
        data: revenues,
        borderColor: '#0d9488', // Teal-600
        backgroundColor: 'rgba(13, 148, 136, 0.08)',
        tension: 0.1, // Less curves, cleaner lines
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: '#0d9488'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: labelColor, font: { family: 'Inter', size: 11, weight: 500 } } }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: labelColor, font: { family: 'Inter', size: 10 } } },
        y: { grid: { color: gridColor }, ticks: { color: labelColor, font: { family: 'Inter', size: 10 } } }
      }
    }
  });

  const catCtx = document.getElementById("categoryChart").getContext("2d");
  categoryChartInstance = new Chart(catCtx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(volumesByCategory),
      datasets: [{
        data: Object.values(volumesByCategory),
        backgroundColor: ['#0d9488', '#0284c7', '#ea580c'], // Teal, Blue, Orange
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { 
          position: 'right',
          labels: { color: labelColor, font: { family: 'Inter', size: 11, weight: 500 } } 
        }
      }
    }
  });
}

// Render Billing Desk
let activeBillingSearch = "";
function renderBillingDeskTable() {
  const tBody = document.getElementById("billing-table-body");
  tBody.innerHTML = "";
  
  let filtered = LabState.orders;
  if (activeBillingSearch) {
    const q = activeBillingSearch.toLowerCase();
    filtered = LabState.orders.filter(o => o.patientName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
  }
  
  // Sort by ID descending (newest first)
  filtered.sort((a,b) => b.id.localeCompare(a.id));
  
  const pageData = getPaginatedData(filtered, paginationState.billing);
  
  if (pageData.items.length === 0) {
    tBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted)">No matching invoices found.</td></tr>`;
    return;
  }
  
  pageData.items.forEach(o => {
    // Map catalog IDs to codes
    const testNames = o.tests.map(tid => {
      const test = LabState.catalog.find(c => c.id === tid);
      return test ? test.code : tid;
    }).join(", ");
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${o.id}</strong></td>
      <td>${o.patientName}</td>
      <td><span class="test-codes" title="${o.tests.join(', ')}">${testNames}</span></td>
      <td><strong>₹${o.total.toLocaleString('en-IN')}</strong></td>
      <td>${o.date}</td>
      <td><span class="badge-status ${o.status.toLowerCase()}">${o.status}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn-table-action" onclick="downloadInvoicePDF('${o.id}')" title="Download Report/Invoice PDF"><i class="fa-solid fa-download"></i></button>
          <button class="btn-table-action delete" onclick="deleteOrder('${o.id}')" title="Delete Invoice"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </td>
    `;
    tBody.appendChild(tr);
  });
  
  renderPaginationControls("billing-pagination", pageData.totalPages, paginationState.billing, "billing", renderBillingDeskTable);
}

// Create New Bill
function openNewBillModal() {
  const patientSelect = document.getElementById("bill-patient-select");
  patientSelect.innerHTML = `<option value="" disabled selected>Select Patient Account</option>`;
  
  LabState.users.filter(u => u.role === "patient").forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.innerText = `${p.name} (ID: ${p.id})`;
    patientSelect.appendChild(opt);
  });
  
  const checklist = document.getElementById("bill-catalog-checklist");
  checklist.innerHTML = "";
  LabState.catalog.forEach(item => {
    const div = document.createElement("div");
    div.className = "checkbox-item";
    div.innerHTML = `
      <label>
        <input type="checkbox" name="bill-tests" value="${item.id}" data-price="${item.price}" onchange="calculateInvoiceSummary()">
        <span>${item.name} (${item.code})</span>
      </label>
      <span class="price-label">₹${item.price}</span>
    `;
    checklist.appendChild(div);
  });
  
  calculateInvoiceSummary();
  document.getElementById("modal-new-bill").classList.remove("hide");
}

function calculateInvoiceSummary() {
  const checked = document.querySelectorAll('input[name="bill-tests"]:checked');
  let subtotal = 0;
  checked.forEach(box => {
    subtotal += parseFloat(box.getAttribute("data-price"));
  });
  
  const discount = Math.round(subtotal * 0.1); // 10% loyalty discount
  const total = subtotal - discount;
  
  document.getElementById("bill-summary-subtotal").innerText = `₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  document.getElementById("bill-summary-discount").innerText = `-₹${discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  document.getElementById("bill-summary-total").innerText = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

function closeNewBillModal() {
  document.getElementById("modal-new-bill").classList.add("hide");
  document.getElementById("form-new-bill").reset();
}

function handleCreateBill(e) {
  e.preventDefault();
  const patId = document.getElementById("bill-patient-select").value;
  const patient = LabState.users.find(u => u.id === patId);
  const checked = document.querySelectorAll('input[name="bill-tests"]:checked');
  
  if (!patId) {
    alert("Please select a patient.");
    return;
  }
  if (checked.length === 0) {
    alert("Please select at least one test profile.");
    return;
  }
  
  const tests = [];
  let subtotal = 0;
  checked.forEach(box => {
    tests.push(box.value);
    subtotal += parseFloat(box.getAttribute("data-price"));
  });
  
  const discount = Math.round(subtotal * 0.1);
  const total = subtotal - discount;
  const orderId = "ord_" + Math.floor(100 + Math.random() * 900);
  
  const newOrder = {
    id: orderId,
    patientId: patId,
    patientName: patient.name,
    tests: tests,
    subtotal: subtotal,
    discount: discount,
    total: total,
    date: new Date().toISOString().substring(0, 10),
    status: "Collected",
    results: null,
    technicianId: null,
    certifiedDate: null,
    doctorNotes: null
  };
  
  LabState.orders.push(newOrder);
  LabState.save();
  
  LabState.addNotification(patId, `Invoice ${orderId} generated successfully. Diagnostic specimen status: Collected.`);
  
  closeNewBillModal();
  renderBillingDeskTable();
}

function deleteOrder(orderId) {
  if (!confirm("Are you sure you want to cancel and delete this diagnostic order?")) return;
  LabState.orders = LabState.orders.filter(o => o.id !== orderId);
  LabState.save();
  renderBillingDeskTable();
}

// Render Diagnostic Test Catalog
function renderTestCatalogGrid() {
  const grid = document.getElementById("catalog-grid-container");
  grid.innerHTML = "";
  
  LabState.catalog.forEach(item => {
    const card = document.createElement("div");
    card.className = "catalog-card";
    card.innerHTML = `
      <div class="catalog-card-header">
        <div>
          <h3>${item.name}</h3>
          <span style="color: var(--accent); font-weight:600; font-size:0.75rem;">Code: ${item.code}</span>
        </div>
        <div class="catalog-actions">
          <button class="btn-table-action" onclick="openEditCatalogModal('${item.id}')" title="Edit Catalog"><i class="fa-solid fa-pencil"></i></button>
          <button class="btn-table-action delete" onclick="deleteCatalog('${item.id}')" title="Delete Profile"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
      <div class="catalog-price-tag">₹${item.price}</div>
      <p class="catalog-desc">${item.desc}</p>
      <div class="catalog-meta-info">
        <span><i class="fa-solid fa-microscope"></i> ${item.dept}</span>
        <span><i class="fa-solid fa-clock"></i> ${item.time} hrs</span>
        <span><i class="fa-solid fa-list-check"></i> ${item.parameters.length} reference limits</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openAddCatalogModal() {
  document.getElementById("catalog-modal-title").innerText = "Create Pathology Test Definition";
  document.getElementById("catalog-id").value = "";
  document.getElementById("form-catalog").reset();
  document.getElementById("catalog-params-list").innerHTML = "";
  addParameterRow(); // start with one blank parameter row
  document.getElementById("modal-catalog").classList.remove("hide");
}

function addParameterRow(name = "", unit = "", min = "", max = "") {
  const list = document.getElementById("catalog-params-list");
  const div = document.createElement("div");
  div.className = "parameter-row";
  div.innerHTML = `
    <input type="text" placeholder="Metric Name" required value="${name}">
    <input type="text" placeholder="Unit" required value="${unit}">
    <input type="number" step="any" placeholder="Min" required value="${min}">
    <input type="number" step="any" placeholder="Max" required value="${max}">
    <button type="button" class="btn-remove-row" onclick="this.parentElement.remove()"><i class="fa-solid fa-circle-minus"></i></button>
  `;
  list.appendChild(div);
}

function openEditCatalogModal(catalogId) {
  const item = LabState.catalog.find(c => c.id === catalogId);
  if (!item) return;
  
  document.getElementById("catalog-modal-title").innerText = "Edit Pathology Test Definition";
  document.getElementById("catalog-id").value = item.id;
  document.getElementById("catalog-name").value = item.name;
  document.getElementById("catalog-code").value = item.code;
  document.getElementById("catalog-dept").value = item.dept;
  document.getElementById("catalog-price").value = item.price;
  document.getElementById("catalog-time").value = item.time;
  document.getElementById("catalog-desc").value = item.desc;
  
  const list = document.getElementById("catalog-params-list");
  list.innerHTML = "";
  item.parameters.forEach(p => {
    addParameterRow(p.name, p.unit, p.min, p.max);
  });
  
  document.getElementById("modal-catalog").classList.remove("hide");
}

function closeCatalogModal() {
  document.getElementById("modal-catalog").classList.add("hide");
  document.getElementById("form-catalog").reset();
}

function handleSaveCatalog(e) {
  e.preventDefault();
  const id = document.getElementById("catalog-id").value;
  const name = document.getElementById("catalog-name").value.trim();
  const code = document.getElementById("catalog-code").value.trim().toUpperCase();
  const dept = document.getElementById("catalog-dept").value.trim();
  const price = parseFloat(document.getElementById("catalog-price").value);
  const time = parseInt(document.getElementById("catalog-time").value);
  const desc = document.getElementById("catalog-desc").value.trim();
  
  // Extract parameters
  const rows = document.querySelectorAll(".parameter-row");
  const parameters = [];
  rows.forEach(r => {
    const inputs = r.querySelectorAll("input");
    parameters.push({
      name: inputs[0].value.trim(),
      unit: inputs[1].value.trim(),
      min: parseFloat(inputs[2].value),
      max: parseFloat(inputs[3].value)
    });
  });
  
  if (parameters.length === 0) {
    alert("Please add at least one parameter limit bound.");
    return;
  }
  
  if (id) {
    // Edit Mode
    const idx = LabState.catalog.findIndex(c => c.id === id);
    LabState.catalog[idx] = { id, name, code, dept, price, time, desc, parameters };
  } else {
    // Create Mode
    const newCat = {
      id: "cat_" + Date.now(),
      name, code, dept, price, time, desc, parameters
    };
    LabState.catalog.push(newCat);
  }
  
  LabState.save();
  closeCatalogModal();
  renderTestCatalogGrid();
}

function deleteCatalog(catalogId) {
  if (!confirm("Are you sure you want to delete this test profile from the catalog?")) return;
  LabState.catalog = LabState.catalog.filter(c => c.id !== catalogId);
  LabState.save();
  renderTestCatalogGrid();
}

// Render Users Directory
let activeUserSearch = "";
function renderUsersTable() {
  const tBody = document.getElementById("users-table-body");
  tBody.innerHTML = "";
  
  let filtered = LabState.users;
  if (activeUserSearch) {
    const q = activeUserSearch.toLowerCase();
    filtered = LabState.users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }
  
  const pageData = getPaginatedData(filtered, paginationState.users);
  
  if (pageData.items.length === 0) {
    tBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted)">No registered accounts found.</td></tr>`;
    return;
  }
  
  pageData.items.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${u.id}</strong></td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.phone}</td>
      <td><span class="header-role-badge" style="text-transform: capitalize">${u.role}</span></td>
      <td>${u.joined}</td>
      <td>
        <div class="table-actions">
          <button class="btn-table-action" onclick="openEditUserModal('${u.id}')" title="Edit Account"><i class="fa-solid fa-pencil"></i></button>
          <button class="btn-table-action delete" onclick="deleteUser('${u.id}')" title="Delete Account" ${u.id === LabState.currentUser.id ? 'disabled' : ''}><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </td>
    `;
    tBody.appendChild(tr);
  });
  
  renderPaginationControls("users-pagination", pageData.totalPages, paginationState.users, "users", renderUsersTable);
}

function openAddUserModal() {
  document.getElementById("user-modal-title").innerText = "Register User Account";
  document.getElementById("user-id").value = "";
  document.getElementById("form-user").reset();
  document.getElementById("modal-user").classList.remove("hide");
}

function openEditUserModal(userId) {
  const user = LabState.users.find(u => u.id === userId);
  if (!user) return;
  
  document.getElementById("user-modal-title").innerText = "Edit User Account";
  document.getElementById("user-id").value = user.id;
  document.getElementById("user-name").value = user.name;
  document.getElementById("user-email").value = user.email;
  document.getElementById("user-role").value = user.role;
  document.getElementById("user-phone").value = user.phone;
  document.getElementById("user-password").value = user.password;
  document.getElementById("user-dob").value = user.dob;
  document.getElementById("user-gender").value = user.gender;
  
  document.getElementById("modal-user").classList.remove("hide");
}

function closeUserModal() {
  document.getElementById("modal-user").classList.add("hide");
  document.getElementById("form-user").reset();
}

function handleSaveUser(e) {
  e.preventDefault();
  const id = document.getElementById("user-id").value;
  const name = document.getElementById("user-name").value.trim();
  const email = document.getElementById("user-email").value.trim().toLowerCase();
  const role = document.getElementById("user-role").value;
  const phone = document.getElementById("user-phone").value.trim();
  const password = document.getElementById("user-password").value;
  const dob = document.getElementById("user-dob").value;
  const gender = document.getElementById("user-gender").value;
  
  if (!id && LabState.users.some(u => u.email.toLowerCase() === email)) {
    alert("An account with this email address already exists.");
    return;
  }
  
  if (id) {
    // Edit Mode
    const idx = LabState.users.findIndex(u => u.id === id);
    const original = LabState.users[idx];
    LabState.users[idx] = { ...original, name, email, role, phone, password, dob, gender };
    
    // If the administrator edited their own credentials, update current session
    if (id === LabState.currentUser.id) {
      LabState.currentUser = LabState.users[idx];
    }
  } else {
    // Create Mode
    const newUser = {
      id: "usr_" + Date.now(),
      name, email, role, phone, password, dob, gender,
      joined: new Date().toISOString().substring(0, 10)
    };
    LabState.users.push(newUser);
  }
  
  LabState.save();
  closeUserModal();
  renderUsersTable();
  updateUserInfoWidgets();
}

function deleteUser(userId) {
  if (userId === LabState.currentUser.id) {
    alert("You cannot delete your own session account.");
    return;
  }
  if (!confirm("Are you sure you want to delete this clinical user account?")) return;
  LabState.users = LabState.users.filter(u => u.id !== userId);
  LabState.save();
  renderUsersTable();
}

// 9. LAB TECHNICIAN OPERATIONS

let activeTechSearch = "";
function renderSamplesQueueTable() {
  const tBody = document.getElementById("samples-table-body");
  tBody.innerHTML = "";
  
  let filtered = LabState.orders;
  if (activeTechSearch) {
    const q = activeTechSearch.toLowerCase();
    filtered = LabState.orders.filter(o => o.patientName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
  }
  
  // Sort: pending queues first
  filtered.sort((a,b) => {
    if (a.status === "Completed" && b.status !== "Completed") return 1;
    if (a.status !== "Completed" && b.status === "Completed") return -1;
    return b.id.localeCompare(a.id);
  });
  
  const pageData = getPaginatedData(filtered, paginationState.samples);
  
  if (pageData.items.length === 0) {
    tBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted)">No samples registered in the queue.</td></tr>`;
    return;
  }
  
  pageData.items.forEach(o => {
    // Map test lists
    const testNames = o.tests.map(tid => {
      const test = LabState.catalog.find(c => c.id === tid);
      return test ? test.name : tid;
    }).join(", ");
    
    // Action details cell
    let metricDetails = `<span class="trend neutral">Pending parameters</span>`;
    let primaryActionBtn = "";
    
    if (o.status === "Completed" && o.results) {
      const count = Object.keys(o.results).length;
      metricDetails = `<span class="trend up" style="font-weight:600;"><i class="fa-solid fa-check-double"></i> ${count} values logged</span>`;
      primaryActionBtn = `<button class="btn-primary btn-sm" onclick="downloadInvoicePDF('${o.id}')"><i class="fa-solid fa-cloud-arrow-down"></i> PDF</button>`;
    } else if (o.status === "Rejected") {
      metricDetails = `<span class="badge-status danger"><i class="fa-solid fa-triangle-exclamation"></i> ${o.rejectionReason || 'Sample Rejected'}</span>`;
      primaryActionBtn = `<span class="badge-status danger">Rejected</span>`;
    } else {
      primaryActionBtn = `
        <div style="display:flex; gap:6px;">
          <button class="btn-primary btn-sm" onclick="openTechMetricsModal('${o.id}')"><i class="fa-solid fa-pen-nib"></i> Enter Results</button>
          <button class="btn-danger btn-sm" onclick="openTechRejectModal('SPEC-${o.id.replace('ord_', '')}', '${o.id}', '${o.patientName}', '${testNames}', 'BAR-883920${o.id.replace('ord_', '')}')"><i class="fa-solid fa-ban"></i> Reject</button>
        </div>
      `;
    }
    
    const isRejected = o.status === "Rejected";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${o.id}</strong><br><small style="color:var(--text-muted);">BAR-883920${o.id.replace('ord_', '')}</small></td>
      <td>${o.patientName}</td>
      <td><span style="font-weight:500;">${testNames}</span></td>
      <td>${o.date}</td>
      <td>
        ${isRejected ? `<span class="badge-status danger">Rejected</span>` : `
        <div class="status-timeline">
          <button class="status-timeline-btn ${o.status === 'Collected' ? 'active collected' : ''}" onclick="updateSampleStatus('${o.id}', 'Collected')">Collected</button>
          <button class="status-timeline-btn ${o.status === 'Processing' ? 'active processing' : ''}" onclick="updateSampleStatus('${o.id}', 'Processing')">Processing</button>
          <button class="status-timeline-btn ${o.status === 'Completed' ? 'active completed' : ''}" onclick="updateSampleStatus('${o.id}', 'Completed')">Completed</button>
        </div>`}
      </td>
      <td>${metricDetails}</td>
      <td>${primaryActionBtn}</td>
    `;
    tBody.appendChild(tr);
  });
  
  renderPaginationControls("samples-pagination", pageData.totalPages, paginationState.samples, "samples", renderSamplesQueueTable);
}

function updateSampleStatus(orderId, newStatus) {
  const o = LabState.orders.find(ord => ord.id === orderId);
  if (!o) return;
  
  // Enforce workflow logic: cannot skip straight to completed without entering metrics values
  if (newStatus === "Completed" && !o.results) {
    alert("Please enter patient diagnostic metric parameters using the 'Enter Results' form before certifying the specimen status as Completed.");
    renderSamplesQueueTable();
    return;
  }
  
  o.status = newStatus;
  LabState.save();
  
  LabState.addNotification(o.patientId, `Your Diagnostic Specimen status for Order #${orderId} has been updated to: ${newStatus}`);
  
  renderSamplesQueueTable();
}

function openTechMetricsModal(orderId) {
  const o = LabState.orders.find(ord => ord.id === orderId);
  if (!o) return;
  
  document.getElementById("metrics-order-id").value = o.id;
  document.getElementById("metrics-patient-name").innerText = o.patientName;
  document.getElementById("metrics-invoice-id").innerText = `#${o.id}`;
  
  // List all tests names ordered in this invoice
  const testNames = o.tests.map(tid => {
    const test = LabState.catalog.find(c => c.id === tid);
    return test ? test.name : tid;
  }).join(" + ");
  document.getElementById("metrics-test-name").innerText = testNames;
  
  // Populate metric parameter inputs
  const inputsContainer = document.getElementById("metrics-inputs-container");
  inputsContainer.innerHTML = "";
  
  o.tests.forEach(testId => {
    const test = LabState.catalog.find(c => c.id === testId);
    if (!test) return;
    
    test.parameters.forEach(p => {
      // Check if we have preexisting results for this metric (editing case)
      const existingVal = o.results && o.results[p.name] !== undefined ? o.results[p.name] : "";
      
      const card = document.createElement("div");
      card.className = "metric-input-card";
      
      const badgeId = `badge-val-${p.name.replace(/\s+/g, '-').replace(/[()]/g, '')}`;
      
      card.innerHTML = `
        <div class="metric-input-header">
          <span><strong>${p.name}</strong> (${test.code})</span>
          <span>Limits: ${p.min} - ${p.max} ${p.unit}</span>
        </div>
        <div class="metric-input-row">
          <input type="number" step="any" name="metric-val" data-name="${p.name}" data-min="${p.min}" data-max="${p.max}" required 
                 placeholder="Enter ${p.unit} value" value="${existingVal}" oninput="validateLiveMetricValue(this, '${badgeId}')">
          <div class="metric-validation-badge" id="${badgeId}">-</div>
        </div>
      `;
      inputsContainer.appendChild(card);
      
      // If editing existing, trigger live validation visually
      if (existingVal !== "") {
        const inp = card.querySelector('input[name="metric-val"]');
        validateLiveMetricValue(inp, badgeId);
      }
    });
  });
  
  document.getElementById("modal-tech-metrics").classList.remove("hide");
}

function validateLiveMetricValue(inputElement, badgeId) {
  const badge = document.getElementById(badgeId);
  if (!badge) return;
  
  const val = parseFloat(inputElement.value);
  const min = parseFloat(inputElement.getAttribute("data-min"));
  const max = parseFloat(inputElement.getAttribute("data-max"));
  
  if (isNaN(val)) {
    badge.innerText = "-";
    badge.className = "metric-validation-badge";
    return;
  }
  
  if (val < 0) {
    // Prevent negative clinical values
    inputElement.value = "";
    badge.innerText = "-";
    badge.className = "metric-validation-badge";
    return;
  }
  
  if (val < min) {
    badge.innerText = "LOW";
    badge.className = "metric-validation-badge low";
  } else if (val > max) {
    badge.innerText = "HIGH";
    badge.className = "metric-validation-badge high";
  } else {
    badge.innerText = "NORMAL";
    badge.className = "metric-validation-badge normal";
  }
}

function closeTechMetricsModal() {
  document.getElementById("modal-tech-metrics").classList.add("hide");
  document.getElementById("form-tech-metrics").reset();
}

function handleSaveMetrics(e) {
  e.preventDefault();
  const orderId = document.getElementById("metrics-order-id").value;
  const o = LabState.orders.find(ord => ord.id === orderId);
  if (!o) return;
  
  const valInputs = document.querySelectorAll('input[name="metric-val"]');
  const results = {};
  
  let hasEmpty = false;
  valInputs.forEach(inp => {
    if (inp.value === "") hasEmpty = true;
    results[inp.getAttribute("data-name")] = parseFloat(inp.value);
  });
  
  if (hasEmpty) {
    alert("Please log values for all parameters before saving.");
    return;
  }
  
  o.results = results;
  o.status = "Completed"; // Auto certify/completed on submission
  o.technicianId = LabState.currentUser.id;
  o.certifiedDate = new Date().toISOString().substring(0, 10);
  
  LabState.save();
  
  LabState.addNotification(o.patientId, `Pathology report certified for Order #${orderId}. Ready for download.`);
  
  closeTechMetricsModal();
  renderSamplesQueueTable();
}


// 10. CONSULTING PHYSICIAN OPERATIONS

let activeDocSearch = "";
function renderDoctorPatientDirectoryTable() {
  const tBody = document.getElementById("doctor-patients-table-body");
  tBody.innerHTML = "";
  
  // Group patients
  const patientUsers = LabState.users.filter(u => u.role === "patient");
  let filtered = patientUsers;
  
  if (activeDocSearch) {
    const q = activeDocSearch.toLowerCase();
    filtered = patientUsers.filter(u => u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q));
  }
  
  const pageData = getPaginatedData(filtered, paginationState.doctorPatients);
  
  if (pageData.items.length === 0) {
    tBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted)">No registered patient records found.</td></tr>`;
    return;
  }
  
  pageData.items.forEach(pat => {
    // Retrieve tests for this patient
    const patOrders = LabState.orders.filter(o => o.patientId === pat.id);
    const certified = patOrders.filter(o => o.status === "Completed").length;
    const processing = patOrders.filter(o => o.status !== "Completed").length;
    
    // Calculate patient age
    const dobDate = new Date(pat.dob);
    const age = new Date().getFullYear() - dobDate.getFullYear();
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${pat.id}</strong></td>
      <td>${pat.name}</td>
      <td>${pat.gender} / ${age} yrs</td>
      <td><span class="badge-status processing">${processing} Active</span></td>
      <td><span class="badge-status completed">${certified} Reports</span></td>
      <td>
        <div class="table-actions">
          <button class="btn-primary btn-sm" onclick="viewPatientMedicalHistory('${pat.id}')"><i class="fa-solid fa-folder-open"></i> Clinical History</button>
        </div>
      </td>
    `;
    tBody.appendChild(tr);
  });
  
  renderPaginationControls("doctor-patients-pagination", pageData.totalPages, paginationState.doctorPatients, "doctorPatients", renderDoctorPatientDirectoryTable);
}

function viewPatientMedicalHistory(patientId) {
  const pat = LabState.users.find(u => u.id === patientId);
  const patOrders = LabState.orders.filter(o => o.patientId === patientId);
  
  // We can build an immersive list showing reports and giving options to add physician comments
  let reportsHtml = "";
  
  patOrders.forEach(o => {
    const testNames = o.tests.map(tid => {
      const test = LabState.catalog.find(c => c.id === tid);
      return test ? test.name : tid;
    }).join(", ");
    
    let actionBlock = "";
    if (o.status === "Completed") {
      actionBlock = `
        <button class="btn-primary btn-sm" onclick="downloadInvoicePDF('${o.id}')" style="margin-right:0.5rem;"><i class="fa-solid fa-download"></i> Report</button>
        <button class="btn-secondary btn-sm" onclick="openDoctorNotesModal('${o.id}')"><i class="fa-solid fa-comment-medical"></i> Add Remarks</button>
      `;
    } else {
      actionBlock = `<span class="trend down"><i class="fa-solid fa-hourglass-half"></i> In Lab Analysis</span>`;
    }
    
    reportsHtml += `
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding:1rem; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:0.25rem;">${testNames}</h4>
          <span style="font-size:0.75rem; color:var(--text-secondary)">Order ID: #${o.id} | Billed: ${o.date}</span>
          ${o.doctorNotes ? `<div style="margin-top:0.5rem; font-size:0.8rem; border-left: 2px solid var(--warning); padding-left:0.5rem; color:var(--text-secondary)"><strong>Clinical Note (${o.doctorNotes.severity}):</strong> ${o.doctorNotes.text}</div>` : ''}
        </div>
        <div>
          ${actionBlock}
        </div>
      </div>
    `;
  });
  
  if (reportsHtml === "") {
    reportsHtml = `<div style="text-align:center; padding:2rem; color:var(--text-muted)">No reports recorded for this patient.</div>`;
  }
  
  // Clean clinical overlay modal
  const histOverlay = document.createElement("div");
  histOverlay.className = "modal-backdrop";
  histOverlay.id = "temp-medical-history-modal";
  histOverlay.innerHTML = `
    <div class="modal-content large-modal" style="background: var(--bg-primary);">
      <div class="modal-header">
        <div>
          <h2>Clinical History - ${pat.name}</h2>
          <span style="font-size:0.75rem; color:var(--text-secondary)">Patient ID: #${pat.id} | DOB: ${pat.dob} | Gender: ${pat.gender}</span>
        </div>
        <button class="btn-close-modal" onclick="document.getElementById('temp-medical-history-modal').remove()">&times;</button>
      </div>
      <div style="max-height:400px; overflow-y:auto; padding-right:0.5rem;">
        ${reportsHtml}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-secondary" onclick="document.getElementById('temp-medical-history-modal').remove()">Close Directory</button>
      </div>
    </div>
  `;
  document.body.appendChild(histOverlay);
}

function openDoctorNotesModal(orderId) {
  // If historical overlay exists, temporarily hide it visually so modal is visible
  const hist = document.getElementById("temp-medical-history-modal");
  if (hist) hist.style.zIndex = "999";
  
  const o = LabState.orders.find(ord => ord.id === orderId);
  if (!o) return;
  
  document.getElementById("doctor-notes-order-id").value = o.id;
  document.getElementById("doc-notes-patient-name").innerText = o.patientName;
  
  const testNames = o.tests.map(tid => {
    const test = LabState.catalog.find(c => c.id === tid);
    return test ? test.code : tid;
  }).join(", ");
  document.getElementById("doc-notes-test-name").innerText = testNames;
  
  if (o.doctorNotes) {
    document.getElementById("doctor-severity").value = o.doctorNotes.severity;
    document.getElementById("doctor-notes-text").value = o.doctorNotes.text;
  } else {
    document.getElementById("doctor-severity").value = "Normal";
    document.getElementById("doctor-notes-text").value = "";
  }
  
  document.getElementById("modal-doctor-notes").classList.remove("hide");
}

function closeDoctorNotesModal() {
  document.getElementById("modal-doctor-notes").classList.add("hide");
  document.getElementById("form-doctor-notes").reset();
  
  // Restore history overlay stack
  const hist = document.getElementById("temp-medical-history-modal");
  if (hist) hist.style.zIndex = "1000";
}

function handleSaveDoctorNotes(e) {
  e.preventDefault();
  const orderId = document.getElementById("doctor-notes-order-id").value;
  const o = LabState.orders.find(ord => ord.id === orderId);
  if (!o) return;
  
  const severity = document.getElementById("doctor-severity").value;
  const text = document.getElementById("doctor-notes-text").value.trim();
  
  o.doctorNotes = {
    doctorId: LabState.currentUser.id,
    doctorName: LabState.currentUser.name,
    severity: severity,
    text: text
  };
  
  LabState.save();
  
  // Alert Patient
  LabState.addNotification(o.patientId, `Dr. ${LabState.currentUser.name} has attached pathology comments on report Order #${orderId}`);
  
  closeDoctorNotesModal();
  
  // Re-render histories if open
  const hist = document.getElementById("temp-medical-history-modal");
  if (hist) {
    hist.remove();
    viewPatientMedicalHistory(o.patientId);
  }
}

// 11. PATIENT PANEL OPERATIONS

function renderPatientDashboard() {
  const oList = LabState.orders.filter(o => o.patientId === LabState.currentUser.id);
  const completed = oList.filter(o => o.status === "Completed");
  const processing = oList.filter(o => o.status !== "Completed");
  
  const dobDate = new Date(LabState.currentUser.dob);
  const age = new Date().getFullYear() - dobDate.getFullYear();
  
  document.getElementById("stat-patient-age").innerText = `${age} yrs`;
  document.getElementById("stat-patient-gender").innerText = LabState.currentUser.gender;
  document.getElementById("stat-patient-orders").innerText = oList.length;
  document.getElementById("stat-patient-processing").innerText = processing.length;
  document.getElementById("stat-patient-completed").innerText = completed.length;
  
  // Render health snapshot parameters based on recent values
  let recentHb = "-";
  let recentChol = "-";
  let recentSugar = "-";
  
  // Traverse completed orders to search recent values
  completed.sort((a,b) => b.date.localeCompare(a.date)); // descending
  
  completed.forEach(o => {
    if (o.results) {
      if (recentHb === "-" && o.results["Hemoglobin (Hb)"] !== undefined) {
        recentHb = o.results["Hemoglobin (Hb)"];
      }
      if (recentChol === "-" && o.results["Total Cholesterol"] !== undefined) {
        recentChol = o.results["Total Cholesterol"];
      }
      if (recentSugar === "-" && o.results["Fasting Glucose"] !== undefined) {
        recentSugar = o.results["Fasting Glucose"];
      }
    }
  });
  
  document.getElementById("health-val-hb").innerText = recentHb !== "-" ? `${recentHb} g/dL` : "-";
  document.getElementById("health-val-chol").innerText = recentChol !== "-" ? `${recentChol} mg/dL` : "-";
  document.getElementById("health-val-sugar").innerText = recentSugar !== "-" ? `${recentSugar} mg/dL` : "-";
  
  // Fill progress-bar scales (Hb range 10-20, Chol 100-300, Sugar 50-200)
  if (recentHb !== "-") {
    const hbPct = Math.min(100, Math.max(0, ((recentHb - 10) / (20 - 10)) * 100));
    document.getElementById("health-progress-hb").style.width = `${hbPct}%`;
  }
  if (recentChol !== "-") {
    const cholPct = Math.min(100, Math.max(0, ((recentChol - 100) / (300 - 100)) * 100));
    document.getElementById("health-progress-chol").style.width = `${cholPct}%`;
  }
  if (recentSugar !== "-") {
    const sugarPct = Math.min(100, Math.max(0, ((recentSugar - 50) / (200 - 50)) * 100));
    document.getElementById("health-progress-sugar").style.width = `${sugarPct}%`;
  }
  
  // Render Doctor Notes list
  const notesContainer = document.getElementById("patient-notes-list");
  notesContainer.innerHTML = "";
  
  const ordersWithNotes = completed.filter(o => o.doctorNotes);
  
  if (ordersWithNotes.length === 0) {
    notesContainer.innerHTML = `<li class="empty-list">No clinical notes or active path remarks recorded by your doctor.</li>`;
    return;
  }
  
  ordersWithNotes.forEach(o => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="note-header">
        <span><strong>${o.doctorNotes.doctorName}</strong></span>
        <span class="note-severity ${o.doctorNotes.severity.toLowerCase()}">${o.doctorNotes.severity}</span>
      </div>
      <div class="note-body">${o.doctorNotes.text}</div>
      <div style="font-size:0.65rem; color:var(--text-muted); margin-top:0.4rem; text-align:right;">Billed Order Ref: #${o.id}</div>
    `;
    notesContainer.appendChild(li);
  });
}

function renderPatientReportsTable() {
  const tBody = document.getElementById("patient-reports-table-body");
  tBody.innerHTML = "";
  
  const oList = LabState.orders.filter(o => o.patientId === LabState.currentUser.id);
  oList.sort((a,b) => b.id.localeCompare(a.id));
  
  const pageData = getPaginatedData(oList, paginationState.patientReports);
  
  if (pageData.items.length === 0) {
    tBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted)">No diagnostic reports recorded.</td></tr>`;
    return;
  }
  
  pageData.items.forEach(o => {
    const testNames = o.tests.map(tid => {
      const test = LabState.catalog.find(c => c.id === tid);
      return test ? test.name : tid;
    }).join(", ");
    
    let dlBtn = `<span class="trend down"><i class="fa-solid fa-clock"></i> In Pathology Lab...</span>`;
    if (o.status === "Completed" || o.paymentStatus === "Paid") {
      dlBtn = `<button class="btn-primary btn-sm" onclick="downloadInvoicePDF('${o.id}')"><i class="fa-solid fa-file-arrow-down"></i> Download Report</button>`;
    }
    
    const notesCell = o.doctorNotes ? `<span class="note-severity ${o.doctorNotes.severity.toLowerCase()}" style="font-size:0.7rem;"><i class="fa-solid fa-comment-medical"></i> ${o.doctorNotes.severity}</span>` : `<span style="color:var(--text-muted)">-</span>`;
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${o.id}</strong></td>
      <td>${testNames}</td>
      <td>₹${o.total}</td>
      <td>${o.date}</td>
      <td><span class="badge-status ${o.status.toLowerCase()}">${o.status}</span></td>
      <td>${notesCell}</td>
      <td>${dlBtn}</td>
    `;
    tBody.appendChild(tr);
  });
  
  renderPaginationControls("patient-reports-pagination", pageData.totalPages, paginationState.patientReports, "patientReports", renderPatientReportsTable);
}

// 12. SEARCH DEBOUNCE / HANDLERS
function handleGlobalSearch(val) {
  const query = val.trim();
  
  if (currentActiveView !== "dashboard") return;
  
  if (currentDashboardSubview === "admin-billing") {
    activeBillingSearch = query;
    paginationState.billing = 1;
    renderBillingDeskTable();
  } else if (currentDashboardSubview === "admin-users") {
    activeUserSearch = query;
    paginationState.users = 1;
    renderUsersTable();
  } else if (currentDashboardSubview === "tech-samples") {
    activeTechSearch = query;
    paginationState.samples = 1;
    renderSamplesQueueTable();
  } else if (currentDashboardSubview === "doctor-records") {
    activeDocSearch = query;
    paginationState.doctorPatients = 1;
    renderDoctorPatientDirectoryTable();
  }
}

// 13. DIGITAL PDF REPORT COMPILING & GENERATOR
function downloadInvoicePDF(orderId) {
  const o = LabState.orders.find(ord => ord.id === orderId) || LabState.orders[0];
  if (!o) return;
  
  const patient = LabState.users.find(u => u.id === o.patientId || u.name === o.patientName) || {
    id: o.patientId || "usr_pat1",
    name: o.patientName || "Rashi Pandya",
    dob: "1998-05-18",
    gender: "Female",
    phone: "+91 98765 43210"
  };
  const tech = LabState.users.find(u => u.id === o.technicianId) || { name: "Parth Panchal (Certifying Tech)" };
  
  const dobDate = new Date(patient.dob || "1998-05-18");
  const age = isNaN(dobDate.getTime()) ? 26 : (new Date().getFullYear() - dobDate.getFullYear());
  
  // Format Results table lines
  let resultsTableBodyHtml = "";
  
  if (o.results) {
    // Loop through each parameter of ordered tests
    o.tests.forEach(testId => {
      const test = LabState.catalog.find(c => c.id === testId);
      if (!test) return;
      
      test.parameters.forEach(p => {
        const val = o.results[p.name];
        if (val === undefined) return;
        
        let flag = "Normal";
        let labelClass = "normal";
        if (val < p.min) {
          flag = "LOW";
          labelClass = "low";
        } else if (val > p.max) {
          flag = "HIGH";
          labelClass = "high";
        }
        
        resultsTableBodyHtml += `
          <tr>
            <td><strong>${p.name}</strong><br><small style="color:#64748b; font-size: 9px;">${test.name}</small></td>
            <td><strong>${val}</strong></td>
            <td>${p.unit}</td>
            <td>${p.min} - ${p.max}</td>
            <td><span class="pdf-flag-label ${labelClass}">${flag}</span></td>
          </tr>
        `;
      });
    });
  } else {
    resultsTableBodyHtml = `<tr><td colspan="5" style="text-align:center; padding:2rem;">Diagnostic testing parameters are still pending clinical verification.</td></tr>`;
  }
  
  // Invoice summary details block
  const billLinesHtml = `
    <div style="margin-top:15px; border:1px solid #e2e8f0; border-radius:6px; padding:12px; font-size:11px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Subtotal:</span><strong>₹${o.subtotal.toFixed(2)}</strong></div>
      <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:#c2410c;"><span>Loyalty Discount (10%):</span><strong>-₹${o.discount.toFixed(2)}</strong></div>
      <div style="display:flex; justify-content:space-between; border-top:1px solid #e2e8f0; padding-top:4px; font-size:12px; font-weight:700; color:#0d9488;"><span>Grand Paid Total:</span><strong>₹${o.total.toFixed(2)}</strong></div>
    </div>
  `;

  // Clinical remarks block
  let remarksBlockHtml = "";
  if (o.doctorNotes) {
    remarksBlockHtml = `
      <div class="pdf-remarks-box">
        <strong>CLINICAL PATHOLOGIST REMARKS (${o.doctorNotes.severity.toUpperCase()}):</strong><br>
        ${o.doctorNotes.text}<br>
        <small style="color: #64748b; display:block; margin-top:4px;">Physician: ${o.doctorNotes.doctorName}</small>
      </div>
    `;
  }
  
  // Generate HTML skeleton to build canvas (Inlined SVG logo to guarantee offline rendering)
  const template = document.getElementById("pdf-rendering-temp");
  template.innerHTML = `
    <div class="pdf-report-document" id="pdf-report-canvas-src">
      <!-- HEADER -->
      <table class="pdf-header-table">
        <tr>
          <td class="pdf-logo-cell">
            <svg viewBox="0 0 100 100" class="pdf-logo-img" style="width: 50px; height: 50px; display: block;">
              <circle cx="50" cy="50" r="46" fill="#f0fdfa" stroke="#e2e8f0" stroke-width="1.5" />
              <path d="M38,25 L45,25 L45,35 L28,68 C25,74 29,81 37,81 L63,81 C71,81 75,74 72,68 L55,35 L55,25 L62,25" fill="none" stroke="#475569" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M32.5,60 L67.5,60 C69.5,64 68.8,70 65,74 C62,77 57,78 50,78 C43,78 38,77 35,74 C31.2,70 30.5,64 32.5,60 Z" fill="#0d9488" />
              <g transform="translate(50, 64)"><path d="M-3,-11 L3,-11 L3,-3 L11,-3 L11,3 L3,3 L3,11 L-3,11 L-3,3 L-11,3 L-11,-3 L-3,-3 Z" fill="#ffffff" /></g>
              <line x1="45" y1="20" x2="55" y2="20" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />
            </svg>
          </td>
          <td style="padding-left: 10px;">
            <div class="pdf-brand-title">APEX CLINICAL LABORATORIES</div>
            <div class="pdf-brand-tagline">Certified Laboratory Pathology Report</div>
          </td>
          <td class="pdf-contacts-cell">
            <strong>Apex Central Pathology Desk</strong><br>
            Suite 102, Medical Access Center<br>
            Mumbai, MH - 400001<br>
            Phone: +91 22 8888 8888 | care@apexlabs.com
          </td>
        </tr>
      </table>
      
      <!-- INVOICE METADATA -->
      <table class="pdf-metadata-table">
        <tr>
          <td><strong>Patient ID:</strong> #${patient.id}</td>
          <td><strong>Patient Name:</strong> ${patient.name}</td>
          <td><strong>Age / Gender:</strong> ${age} / ${patient.gender}</td>
        </tr>
        <tr>
          <td><strong>Order ID:</strong> #${o.id}</td>
          <td><strong>Billed Date:</strong> ${o.date}</td>
          <td><strong>Report Certified Date:</strong> ${o.certifiedDate || '-'}</td>
        </tr>
        <tr>
          <td><strong>Ref Physician:</strong> ${o.doctorNotes ? o.doctorNotes.doctorName : 'Self Referral'}</td>
          <td><strong>Certifying Technician:</strong> ${tech.name}</td>
          <td><strong>Payment Status:</strong> PAID (Invoiced)</td>
        </tr>
      </table>
      
      <!-- RESULTS SECTION -->
      <div class="pdf-section-title">Diagnostic Test Results Parameters</div>
      <table class="pdf-results-table">
        <thead>
          <tr>
            <th>Diagnostic Test & Metric</th>
            <th>Observed Value</th>
            <th>Standard Unit</th>
            <th>Biological Ref Intervals</th>
            <th>Clinical Interpretation</th>
          </tr>
        </thead>
        <tbody>
          ${resultsTableBodyHtml}
        </tbody>
      </table>
      
      <!-- BILL SUMMARY -->
      <div class="pdf-section-title" style="margin-top:15px;">Invoice Summary Details</div>
      ${billLinesHtml}
      
      <!-- DOCTOR REMARKS -->
      ${remarksBlockHtml}
      
      <!-- SIGNATURES -->
      <table class="pdf-signatures-table">
        <tr>
          <td>
            <div class="pdf-sig-line"></div>
            <div class="pdf-sig-name">${tech.name}</div>
            Certified Laboratory Technician
          </td>
          <td>
            <div class="pdf-sig-line"></div>
            <div class="pdf-sig-name">${o.doctorNotes ? o.doctorNotes.doctorName : 'Dr. Zainab Khilji'}</div>
            Certifying Pathologist / Physician
          </td>
        </tr>
      </table>
      
      <!-- FOOTER NOTE -->
      <div class="pdf-footer-note">
        *** End of Pathology Report ***<br>
        This diagnostic medical report was electronically compiled, verified, and certified under clinical LIMS authorization. No physical signatures required.<br>
        For clinical correlation, please consult your physician.
      </div>
    </div>
  `;

  // Compile PDF via jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'pt', 'a4');
  
  // Force visible font styling and render element via html canvas capture
  const targetElement = document.getElementById("pdf-report-canvas-src");
  
  doc.html(targetElement, {
    callback: function (doc) {
      doc.save(`ApexLabs_Report_${patient.name.replace(/\s+/g, '_')}_${orderId}.pdf`);
      template.innerHTML = ""; // clean up
    },
    x: 0,
    y: 0,
    width: 595.28, // A4 width at 72dpi is 595 pt
    windowWidth: 790 // scale down from source element bounds
  });
}

// ==========================================================================
// 15. FULL-STACK BACKEND API INTERFACE & ENHANCED FEATURE CONTROLLER
// ==========================================================================
const API_BASE_URL = "http://localhost:8080/api";

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend API offline or unreachable, operating in local mode:", err);
  }
  return null;
}

// --- A) PATIENT PROFILE & SECURITY HANDLERS ---
function renderPatientProfile() {
  const u = LabState.currentUser;
  if (!u) return;

  document.getElementById("profile-name").value = u.name || "";
  document.getElementById("profile-email").value = u.email || "";
  document.getElementById("profile-phone").value = u.phone || "";
  document.getElementById("profile-dob").value = u.dob || "";
  document.getElementById("profile-gender").value = u.gender || "Female";
  document.getElementById("profile-address").value = u.address || "";
}

async function handleSavePatientProfile(e) {
  e.preventDefault();
  const u = LabState.currentUser;
  if (!u) return;

  u.name = document.getElementById("profile-name").value.trim();
  u.email = document.getElementById("profile-email").value.trim();
  u.phone = document.getElementById("profile-phone").value.trim();
  u.dob = document.getElementById("profile-dob").value;
  u.gender = document.getElementById("profile-gender").value;
  u.address = document.getElementById("profile-address").value.trim();

  // Update in local state
  LabState.save();
  updateUserInfoWidgets();

  // Sync to REST API Backend
  await apiFetch("/users", {
    method: "PUT",
    body: JSON.stringify({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      dob: u.dob,
      gender: u.gender,
      address: u.address,
      role: u.role
    })
  });

  alert("Profile information updated successfully.");
}

async function handlePatientChangePassword(e) {
  e.preventDefault();
  const u = LabState.currentUser;
  const currentPwd = document.getElementById("pwd-current").value;
  const newPwd = document.getElementById("pwd-new").value;
  const confirmPwd = document.getElementById("pwd-confirm").value;

  if (currentPwd !== u.password) {
    alert("Current password is incorrect.");
    return;
  }
  if (newPwd !== confirmPwd) {
    alert("New password and confirmation do not match.");
    return;
  }
  if (newPwd.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  u.password = newPwd;
  LabState.save();

  // Sync to REST API Backend
  await apiFetch("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      userId: u.id,
      currentPassword: currentPwd,
      newPassword: newPwd
    })
  });

  document.getElementById("form-patient-password").reset();
  alert("Account security password updated successfully.");
}

// --- B) PATIENT PAYMENT GATEWAY & BILLING ---
function renderPatientBillingTable() {
  const tBody = document.getElementById("patient-billing-table-body");
  tBody.innerHTML = "";

  const u = LabState.currentUser;
  const patientOrders = LabState.orders.filter(o => o.patientId === u.id);

  if (patientOrders.length === 0) {
    tBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--text-muted);">No invoices recorded for your account.</td></tr>`;
    return;
  }

  patientOrders.forEach(o => {
    const testNames = o.tests.map(tid => {
      const t = LabState.catalog.find(c => c.id === tid);
      return t ? t.code : tid;
    }).join(", ");

    const isPaid = o.status === "Completed" || o.paymentStatus === "Paid";
    const statusLabel = isPaid ? "Paid" : "Unpaid";
    const statusClass = isPaid ? "completed" : "pending";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#INV-${o.id.replace('ord_', '')}</strong></td>
      <td>${testNames}</td>
      <td>${o.date}</td>
      <td>₹${o.subtotal.toLocaleString('en-IN')}</td>
      <td>-₹${o.discount.toLocaleString('en-IN')}</td>
      <td><strong>₹${o.total.toLocaleString('en-IN')}</strong></td>
      <td><span class="badge-status ${statusClass}">${statusLabel}</span></td>
      <td>
        ${isPaid ? `<span class="badge-status completed"><i class="fa-solid fa-circle-check"></i> Paid Online</span>` : 
        `<button class="btn-primary btn-sm" onclick="openPatientCheckoutModal('${o.id}')"><i class="fa-solid fa-credit-card"></i> Pay Online</button>`}
      </td>
    `;
    tBody.appendChild(tr);
  });
}

function openPatientCheckoutModal(orderId) {
  const o = LabState.orders.find(item => item.id === orderId);
  if (!o) return;

  document.getElementById("checkout-invoice-id").value = orderId;
  document.getElementById("checkout-amount").value = o.total;
  document.getElementById("checkout-display-total").innerText = `₹${o.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  switchPayMethod('upi');
  document.getElementById("modal-patient-checkout").classList.remove("hide");
}

function closePatientCheckoutModal() {
  document.getElementById("modal-patient-checkout").classList.add("hide");
}

function switchPayMethod(method) {
  document.querySelectorAll(".pay-panel").forEach(p => p.classList.add("hide"));
  if (method === 'upi') {
    document.getElementById("pay-panel-upi").classList.remove("hide");
  } else if (method === 'card') {
    document.getElementById("pay-panel-card").classList.remove("hide");
  } else if (method === 'netbanking') {
    document.getElementById("pay-panel-netbanking").classList.remove("hide");
  }
}

async function handleProcessOnlinePayment(e) {
  e.preventDefault();
  const orderId = document.getElementById("checkout-invoice-id").value;
  const amount = parseFloat(document.getElementById("checkout-amount").value);
  const payMethod = document.querySelector('input[name="pay-method"]:checked').value;

  const o = LabState.orders.find(item => item.id === orderId);
  if (o) {
    o.paymentStatus = "Paid";
    LabState.save();
  }

  // Call REST API
  await apiFetch("/payments", {
    method: "POST",
    body: JSON.stringify({
      invoice_id: "INV-" + orderId.replace('ord_', ''),
      patient_id: LabState.currentUser.id,
      patient_name: LabState.currentUser.name,
      amount: amount,
      payment_method: payMethod
    })
  });

  // Add Notifications
  LabState.addNotification(LabState.currentUser.id, `Payment of ₹${amount} for Invoice #${orderId} was successful via ${payMethod}.`);

  closePatientCheckoutModal();
  renderPatientBillingTable();
  alert(`Payment Authorization Successful!\nTransaction ID: TXN${Math.floor(Math.random() * 89999999 + 10000000)}\nPayment of ₹${amount} received.`);
}

// --- C) DOCTOR LABORATORY TEST ORDERING ---
function openDoctorOrderModal() {
  const patientSelect = document.getElementById("doc-order-patient-select");
  patientSelect.innerHTML = `<option value="" disabled selected>Select Target Patient</option>`;

  LabState.users.filter(u => u.role === "patient").forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.innerText = `${p.name} (${p.email})`;
    patientSelect.appendChild(opt);
  });

  const checklist = document.getElementById("doc-order-catalog-checklist");
  checklist.innerHTML = "";
  LabState.catalog.forEach(item => {
    const div = document.createElement("div");
    div.className = "checkbox-item";
    div.innerHTML = `
      <label>
        <input type="checkbox" name="doc-order-tests" value="${item.id}" data-name="${item.name}">
        <span>${item.name} (${item.code})</span>
      </label>
      <span class="price-label">₹${item.price}</span>
    `;
    checklist.appendChild(div);
  });

  document.getElementById("modal-doctor-order").classList.remove("hide");
}

function closeDoctorOrderModal() {
  document.getElementById("modal-doctor-order").classList.add("hide");
}

async function handleCreateDoctorOrder(e) {
  e.preventDefault();
  const patientId = document.getElementById("doc-order-patient-select").value;
  const priority = document.getElementById("doc-order-priority").value;
  const notes = document.getElementById("doc-order-notes").value.trim();

  const checked = document.querySelectorAll('input[name="doc-order-tests"]:checked');
  if (checked.length === 0) {
    alert("Please select at least one pathology test definition.");
    return;
  }

  const testIds = Array.from(checked).map(cb => cb.value);
  const testNames = Array.from(checked).map(cb => cb.getAttribute("data-name")).join(", ");
  const patient = LabState.users.find(u => u.id === patientId);

  const subtotal = testIds.reduce((sum, tid) => {
    const t = LabState.catalog.find(c => c.id === tid);
    return sum + (t ? t.price : 0);
  }, 0);

  const discount = Math.round(subtotal * 0.1);
  const total = subtotal - discount;
  const orderId = "ord_" + Math.floor(Math.random() * 899 + 100);

  const newOrder = {
    id: orderId,
    patientId: patientId,
    patientName: patient ? patient.name : "Patient",
    tests: testIds,
    subtotal: subtotal,
    discount: discount,
    total: total,
    date: new Date().toISOString().substring(0, 10),
    status: "Collected",
    priority: priority,
    notes: notes,
    results: null,
    technicianId: null,
    certifiedDate: null,
    doctorNotes: null
  };

  LabState.orders.unshift(newOrder);
  LabState.save();

  // Send REST API call
  await apiFetch("/orders", {
    method: "POST",
    body: JSON.stringify({
      patient_id: patientId,
      patient_name: patient ? patient.name : "Patient",
      doctor_id: LabState.currentUser.id,
      doctor_name: LabState.currentUser.name,
      test_ids: testIds.join(","),
      test_names: testNames,
      priority: priority,
      notes: notes
    })
  });

  closeDoctorOrderModal();
  renderDoctorPatientDirectoryTable();
  alert(`Diagnostic test order #${orderId} submitted successfully for ${patient ? patient.name : 'Patient'}.`);
}

// --- D) DOCTOR CLINICAL NOTES ---
function renderDoctorNotesTable() {
  const tBody = document.getElementById("doctor-notes-table-body");
  tBody.innerHTML = "";

  const notesList = LabState.orders.filter(o => o.doctorNotes).map(o => o.doctorNotes);

  if (notesList.length === 0) {
    tBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--text-muted);">No clinical pathologist notes recorded yet.</td></tr>`;
    return;
  }

  notesList.forEach((n, idx) => {
    const severityClass = n.severity === "Urgent" ? "danger" : (n.severity === "Medium" ? "pending" : "completed");
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#NOTE-${100 + idx}</strong></td>
      <td>2026-08-25</td>
      <td>${n.patientName || 'Rashi Pandya'}</td>
      <td>${n.doctorName}</td>
      <td><span class="badge-status ${severityClass}">${n.severity}</span></td>
      <td>${n.text}</td>
      <td>
        <button class="btn-table-action" title="View Details"><i class="fa-solid fa-eye"></i></button>
      </td>
    `;
    tBody.appendChild(tr);
  });
}

function openDoctorNotesModal(orderId = null, patientId = null) {
  const select = document.getElementById("doc-notes-patient-select");
  select.innerHTML = `<option value="" disabled selected>Select Patient</option>`;
  LabState.users.filter(u => u.role === "patient").forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.innerText = p.name;
    select.appendChild(opt);
  });

  if (orderId) document.getElementById("doctor-notes-order-id").value = orderId;
  document.getElementById("modal-doctor-notes").classList.remove("hide");
}

function closeDoctorNotesModal() {
  document.getElementById("modal-doctor-notes").classList.add("hide");
}

async function handleSaveDoctorNotes(e) {
  e.preventDefault();
  const orderId = document.getElementById("doctor-notes-order-id").value || LabState.orders[0]?.id;
  const patientId = document.getElementById("doc-notes-patient-select").value;
  const severity = document.getElementById("doctor-severity").value;
  const text = document.getElementById("doctor-notes-text").value.trim();

  const o = LabState.orders.find(item => item.id === orderId) || LabState.orders[0];
  const patient = LabState.users.find(u => u.id === patientId) || LabState.users.find(u => u.id === o?.patientId);

  if (o) {
    o.doctorNotes = {
      doctorId: LabState.currentUser.id,
      doctorName: LabState.currentUser.name,
      patientName: patient ? patient.name : o.patientName,
      severity: severity,
      text: text
    };
    LabState.save();
  }

  // REST API Call
  await apiFetch("/clinical-notes", {
    method: "POST",
    body: JSON.stringify({
      patient_id: patientId || (o ? o.patientId : "usr_pat1"),
      patient_name: patient ? patient.name : (o ? o.patientName : "Rashi Pandya"),
      doctor_id: LabState.currentUser.id,
      doctor_name: LabState.currentUser.name,
      order_id: orderId,
      severity: severity,
      notes_text: text
    })
  });

  closeDoctorNotesModal();
  renderDoctorNotesTable();
  alert("Clinical pathologist remarks attached successfully.");
}

// --- E) TECHNICIAN SPECIMEN REJECTION ---
function openTechRejectModal(specimenId, orderId, patientName, testName, specCode) {
  document.getElementById("reject-specimen-id").value = specimenId;
  document.getElementById("reject-order-id").value = orderId;
  document.getElementById("reject-spec-code").innerText = specCode || specimenId;
  document.getElementById("reject-patient-name").innerText = patientName;
  document.getElementById("reject-test-name").innerText = testName;

  document.getElementById("modal-tech-reject").classList.remove("hide");
}

function closeTechRejectModal() {
  document.getElementById("modal-tech-reject").classList.add("hide");
}

async function handleConfirmSampleRejection(e) {
  e.preventDefault();
  const specimenId = document.getElementById("reject-specimen-id").value;
  const orderId = document.getElementById("reject-order-id").value;
  const reason = document.getElementById("reject-reason-select").value;
  const notes = document.getElementById("reject-additional-notes").value.trim();

  const o = LabState.orders.find(item => item.id === orderId);
  if (o) {
    o.status = "Rejected";
    o.rejectionReason = reason + (notes ? ` (${notes})` : "");
    LabState.save();
  }

  // REST API Call
  await apiFetch("/specimens", {
    method: "POST",
    body: JSON.stringify({
      action: "reject",
      id: specimenId,
      order_id: orderId,
      rejection_reason: reason + (notes ? ` (${notes})` : ""),
      technician_name: LabState.currentUser.name
    })
  });

  closeTechRejectModal();
  renderSamplesQueueTable();
  alert(`Specimen ${specimenId} rejected and medical alert notification dispatched.`);
}

// --- F) ADMIN AUDIT LOGS ---
async function renderAuditLogs() {
  const tBody = document.getElementById("audit-table-body");
  tBody.innerHTML = "";

  const filter = document.getElementById("audit-category-filter")?.value || "ALL";

  // Try REST API backend fetch first
  let logs = await apiFetch("/audit-logs");
  if (!logs || logs.length === 0) {
    // Fallback seed audit logs
    logs = [
      { id: "AUD-1001", timestamp: "2026-08-25 10:15", user_name: "Tanish Patel", role: "Admin", action: "User Login", category: "Auth", details: "Signed into Admin Operations Control." },
      { id: "AUD-1002", timestamp: "2026-08-25 10:22", user_name: "Dr. Zainab Khilji", role: "Doctor", action: "Order Created", category: "Orders", details: "Created diagnostic order #ord_104 for Rashi Pandya." },
      { id: "AUD-1003", timestamp: "2026-08-25 11:05", user_name: "Parth Panchal", role: "Technician", action: "Sample Rejection", category: "Laboratory", details: "Rejected specimen SPEC-102. Reason: Hemolyzed Sample." },
      { id: "AUD-1004", timestamp: "2026-08-25 11:45", user_name: "Rashi Pandya", role: "Patient", action: "Online Payment", category: "Billing", details: "Paid ₹405.00 online via UPI for Invoice #INV-101." },
      { id: "AUD-1005", timestamp: "2026-08-25 12:10", user_name: "Rashi Pandya", role: "Patient", action: "Password Changed", category: "Security", details: "Updated account security password." }
    ];
  }

  let filtered = logs;
  if (filter !== "ALL") {
    filtered = logs.filter(l => l.category === filter);
  }

  if (filtered.length === 0) {
    tBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--text-muted);">No audit log entries matching selected category.</td></tr>`;
    return;
  }

  filtered.forEach(l => {
    const catClass = l.category ? l.category.toLowerCase() : "auth";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${l.id}</strong></td>
      <td>${l.timestamp}</td>
      <td>${l.user_name}</td>
      <td><span class="badge-status neutral">${l.role}</span></td>
      <td><strong>${l.action}</strong></td>
      <td><span class="audit-badge ${catClass}">${l.category}</span></td>
      <td>${l.details}</td>
    `;
    tBody.appendChild(tr);
  });
}

// --- G) SINGLE SOURCE OF TRUTH BACKEND SYNCHRONIZER ---
async function syncWithBackend() {
  try {
    // Fetch Orders from SQLite REST API
    const apiOrders = await apiFetch("/orders");
    if (apiOrders && Array.isArray(apiOrders) && apiOrders.length > 0) {
      apiOrders.forEach(ao => {
        let existing = LabState.orders.find(o => o.id === ao.id || o.id === "ord_" + ao.id.replace("ORD-", ""));
        if (!existing) {
          existing = {
            id: ao.id,
            patientId: ao.patient_id,
            patientName: ao.patient_name,
            tests: ao.test_ids ? ao.test_ids.split(",") : ["cat_cbc"],
            subtotal: 600,
            discount: 60,
            total: 540,
            date: ao.order_date ? ao.order_date.substring(0, 10) : new Date().toISOString().substring(0, 10),
            status: ao.status,
            priority: ao.priority || "Routine",
            notes: ao.notes || "",
            results: null,
            technicianId: "usr_tech",
            certifiedDate: null,
            doctorNotes: null
          };
          LabState.orders.unshift(existing);
        } else {
          existing.status = ao.status;
          if (ao.status === "Completed" || ao.status === "Paid") {
            existing.paymentStatus = "Paid";
          }
        }
      });
    }

    // Fetch Payments & Invoices from SQLite REST API
    const apiPayments = await apiFetch("/payments");
    if (apiPayments && Array.isArray(apiPayments)) {
      apiPayments.forEach(pay => {
        if (pay.status === "Completed" || pay.status === "Paid") {
          const targetOrderId = pay.invoice_id ? pay.invoice_id.replace("INV-", "").replace("ord_", "") : "";
          LabState.orders.forEach(o => {
            if (o.id.includes(targetOrderId) || (o.patientId === pay.patient_id && Math.abs(pay.amount - o.total) < 1)) {
              o.paymentStatus = "Paid";
              o.status = "Completed";
            }
          });
        }
      });
    }

    // Fetch Users from SQLite REST API
    const apiUsers = await apiFetch("/users");
    if (apiUsers && Array.isArray(apiUsers) && apiUsers.length > 0) {
      apiUsers.forEach(au => {
        if (!LabState.users.some(u => u.id === au.id || u.email.toLowerCase() === au.email.toLowerCase())) {
          LabState.users.push({
            id: au.id,
            name: au.name,
            email: au.email,
            phone: au.phone || "+91 98765 43210",
            dob: au.dob || "1995-01-01",
            gender: au.gender || "Male",
            role: au.role,
            password: au.password || "patient123",
            joined: au.created_at ? au.created_at.substring(0, 10) : new Date().toISOString().substring(0, 10)
          });
        }
      });
    }

    LabState.save();
  } catch (err) {
    console.warn("Backend sync notice:", err);
  }
}

// Initialize Application on DOM Load
window.addEventListener("DOMContentLoaded", async () => {
  await syncWithBackend();
  // Check if session exists
  if (LabState.currentUser) {
    navigateTo("dashboard");
  } else {
    navigateTo("auth");
  }
});
