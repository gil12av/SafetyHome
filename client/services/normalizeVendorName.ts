export function normalizeVendorName(rawName: string): string | null {
    if (!rawName) return null;
    const lower = rawName.toLowerCase();
    if (lower.includes("aqara")) return "aqara";
    if (lower.includes("esp")) return "espressif";
    if (lower.includes("yeelink")) return "yeelight";
    if (lower.includes("sensibo")) return "sensibo";
    if (lower.includes("tuya")) return "tuya";
    if (lower.includes("broadlink")) return "broadlink";
    return null;
  }
  