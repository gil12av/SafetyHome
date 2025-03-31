// זיהוי יצרן לפי שם רכיב באמצעות מילות מפתח
import vendorKeywords from "./vendorKeyword";

export function detectVendorFromDeviceName(deviceName) {
  if (!deviceName) return null;

  const lowerName = deviceName.toLowerCase();
  for (const keyword in vendorKeywords) {
    if (lowerName.includes(keyword)) {
      return vendorKeywords[keyword];
    }
  }

  return null; // לא זוהה יצרן
}
