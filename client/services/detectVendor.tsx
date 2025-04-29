// detectVendor.ts - מזהה שם יצרן חכם לפי כתובת MAC או שם רכיב

// 🧠 זיהוי לפי שלושת הבתים הראשונים של כתובת MAC (OUI)
const ouiVendors: Record<string, string> = {
    "58:D3:49": "xiaomi",
    "FC:FB:FB": "apple",
    "E0:4F:43": "samsung",
    "18:B4:30": "yeelight",
    "7C:49:EB": "aqara",
    "CC:50:E3": "philips",
    "2C:F4:32": "amazon",
    "84:0D:8E": "broadlink",
    "DC:4A:3E": "tp-link"
  };
  
  // 🧠 זיהוי לפי מחרוזת בשם הרכיב - מחפש מילות מפתח נפוצות
  const deviceKeywords = [
    { keyword: "yeelight", vendor: "yeelight" },
    { keyword: "aqara", vendor: "aqara" },
    { keyword: "esp", vendor: "espressif" },
    { keyword: "broadlink", vendor: "broadlink" },
    { keyword: "tplink", vendor: "tp-link" },
    { keyword: "philips", vendor: "philips" },
    { keyword: "tuya", vendor: "tuya" },
    { keyword: "sonoff", vendor: "sonoff" },
    { keyword: "apple", vendor: "apple" },
    { keyword: "amazon", vendor: "amazon" }
  ];
  
  // 🧠 מנסה לזהות את היצרן מתוך כתובת MAC
  function detectFromMac(mac?: string): string | null {
    if (!mac) return null;
    const prefix = mac.toUpperCase().slice(0, 8);
    return ouiVendors[prefix] || null;
  }
  
  // 🧠 מנסה לזהות את היצרן מתוך שם רכיב (deviceName)
  function detectFromName(name?: string): string | null {
    if (!name) return null;
    const lowerName = name.toLowerCase();
    for (const entry of deviceKeywords) {
      if (lowerName.includes(entry.keyword)) return entry.vendor;
    }
    return null;
  }
  
  // 🧠 עושה נרמול של שמות יצרנים שונים לצורת שם אחידה
  function normalizeVendor(name: string): string {
    const map: Record<string, string> = {
      "yeelink": "yeelight",
      "esp": "espressif",
      "aqara-hub": "aqara",
      "tp": "tp-link",
      "tuya inc.": "tuya"
    };
    const lower = name.toLowerCase();
    return map[lower] || lower;
  }
  
  // ✅ פונקציה ראשית: מזהה שם יצרן לפי MAC או שם רכיב, ומחזירה תוצאה מנורמלת
  export function detectVendor({ macAddress, deviceName }: { macAddress?: string; deviceName?: string }): string | null {
    let vendor = detectFromMac(macAddress) || detectFromName(deviceName);
    return vendor ? normalizeVendor(vendor) : null;
  }
  