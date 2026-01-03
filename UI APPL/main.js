let currentUser = "";
let medications = [
    { id: 1, name: "Aspirin", time: "08:00", desc: "1 Tablet setelah sarapan", status: "active" },
    { id: 2, name: "Vitamin D", time: "18:00", desc: "Diminum saat makan malam", status: "active" }
];
let historyLogs = [];

// Fungsi Login
function login(role) {
    currentUser = role;
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-container").style.display = "flex";
    
    // Sesuaikan akses menu
    const navInput = document.getElementById("nav-input");
    const welcomeText = document.getElementById("welcome-text");
    const userDisplay = document.getElementById("user-display");

    if (role === "nakes") {
        navInput.style.display = "flex";
        welcomeText.innerText = "Halo, Tenaga Medis!";
        userDisplay.innerText = "Role: Nakes";
    } else {
        navInput.style.display = "none";
        welcomeText.innerText = "Halo, Bapak/Ibu!";
        userDisplay.innerText = "Role: Pasien";
        showNotification(); // Simulasi Requirement 1
    }
    renderMeds();
}

// Navigasi Tab
function switchTab(tabId) {
    // Hilangkan semua tab aktif
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".nav-links li").forEach(li => li.classList.remove("active"));

    // Tampilkan tab yang dipilih
    document.getElementById(`tab-${tabId}`).classList.add("active");
    document.getElementById("page-title").innerText = tabId.replace("-", " ").toUpperCase();
    
    // Set active link di sidebar
    event.currentTarget.classList.add("active");
}

// Tambah Obat (Nakes)
function addMedication() {
    const name = document.getElementById("nama-obat").value;
    const time = document.getElementById("waktu-obat").value;
    const desc = document.getElementById("desc-obat").value;

    if (!name || !time) return alert("Mohon isi Nama Obat dan Waktu!");

    const newMed = { id: Date.now(), name, time, desc, status: "active" };
    medications.push(newMed);
    alert("Jadwal Berhasil Ditambahkan!");
    renderMeds();
    switchTab('jadwal-obat');
}

// Render Daftar Obat
function renderMeds() {
    const listDiv = document.getElementById("medication-list");
    listDiv.innerHTML = "";

    medications.forEach(med => {
        const card = document.createElement("div");
        card.className = "med-card fade-in";
        card.innerHTML = `
            <span style="color: var(--primary); font-weight: bold;">⏰ Pukul ${med.time}</span>
            <h3>${med.name}</h3>
            <p>${med.desc}</p>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                ${currentUser === 'pasien' ? `
                    <button class="btn-logout" style="background:#dcfce7; color:#166534;" onclick="actionMed(${med.id}, 'Diminum')">✔️ Sudah</button>
                    <button class="btn-logout" onclick="actionMed(${med.id}, 'Terlewat')">❌ Tidak</button>
                ` : `<small style="color: #a0aec0;">Status: Aktif</small>`}
            </div>
        `;
        listDiv.appendChild(card);
    });
}

// Aksi Pasien (Requirement 3 & 4)
function actionMed(id, status) {
    const index = medications.findIndex(m => m.id === id);
    const med = medications[index];

    const log = {
        name: med.name,
        time: med.time,
        action: status,
        date: new Date().toLocaleString("id-ID")
    };

    historyLogs.unshift(log); // Tambah ke riwayat (paling atas)
    medications.splice(index, 1); // Hapus dari jadwal aktif
    
    renderMeds();
    renderHistory();
    alert(`Status obat ${med.name} dicatat sebagai: ${status}`);
}

// Render Riwayat
function renderHistory() {
    const histDiv = document.getElementById("history-list");
    if (historyLogs.length === 0) return;

    histDiv.innerHTML = "<h3>Log Penggunaan Obat</h3><br>";
    historyLogs.forEach(log => {
        histDiv.innerHTML += `
            <div style="padding: 15px; border-bottom: 1px solid #eee;">
                <strong>${log.name}</strong> - ${log.date} 
                <span style="color: ${log.action === 'Diminum' ? 'green' : 'red'}; font-weight: bold;">(${log.action})</span>
            </div>
        `;
    });
}

// Notifikasi (Requirement 1)
function showNotification() {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Waktunya Minum Obat!", { body: "Cek jadwal obat Anda hari ini." });
    } else {
        alert("🔔 PENGINGAT: Jangan lupa cek jadwal minum obat Anda!");
    }
}

function logout() {
    location.reload();
}

// Minta izin notifikasi
if ("Notification" in window) Notification.requestPermission();