# SafetyHome 🏠🔐

Smart Home Network Scanner & Security Advisor

## 📋 Overview
SafetyHome is a mobile application designed to help users improve the security of their smart home network. It identifies devices connected to the local network and detects known vulnerabilities using real-time integration with the NVD (CVE) database.

The app is designed for non-technical users, offering a friendly interface, visual alerts, and practical recommendations for improving network security.

---

## 🚀 Features
- ✅ **User Authentication** – Register and login with secure session handling
- ✅ **Network Scan** – Scan home network using Python + Nmap
- ✅ **Device Identification** – Show connected devices (name, IP, MAC, scan date)
- ✅ **Vulnerability Detection** – Integrate with NVD API to fetch CVEs
- ✅ **Security Alerts Screen** – Display vulnerabilities and recommendations
- ✅ **Scan History** – Store and display scan history per user
- ✅ **FAQ & Support UI** – Help section for non-technical users
- 🟡 **Planned:**
  - Direct device actions (firmware update, password reset)
  - Scheduled scans
  - AI-driven threat analysis
  - Smart support chatbot

---

## 🛠️ Technologies
- **Frontend:** React Native + Expo
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Scanner:** Python with Nmap
- **APIs:** CVE/NVD API, Axios-based client

---

## 📁 Project Structure
- `/components` – Reusable UI components
- `/screens` – Home, Dashboard, Scan, Devices, Alerts, FAQ
- `/context` – AuthContext for session management
- `/services/api.jsx` – API integration (scan, login, CVE fetch)
- `/server` – Node.js server, Express routes, Python scanner bridge

---

## 🧪 Security
- Passwords are encrypted
- Tokens are stored securely in AsyncStorage
- Network access uses Bearer Token Authentication
- Devices are not controlled – only analyzed for now

---

## 📊 Status
Project is in working MVP stage with full scan-to-alert pipeline completed. Passive security recommendations are implemented. Further development planned for real-time actions and smart automation.

---

## 📬 Contact
For academic or development inquiries, please contact via project maintainers.

