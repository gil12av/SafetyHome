describe('🧪 בדיקות מדומות לטופס התחברות/הרשמה', () => {
    test('בודק שסיסמאות תואמות', () => {
      const password = "123456";
      const confirmPassword = "123456";
      expect(password).toBe(confirmPassword);
    });
  
    test('בודק שכתובת אימייל תקינה', () => {
      const email = "gil@example.com";
      const isValid = /\S+@\S+\.\S+/.test(email);
      expect(isValid).toBe(true);
    });
  
    test('בודק ששם פרטי כולל רק אותיות', () => {
      const name = "Avraham";
      const isValid = /^[a-zA-Z]+$/.test(name);
      expect(isValid).toBe(true);
    });
  
    test('בודק שלא ניתן להירשם ללא אימייל', () => {
      const formData = { email: "", password: "1234" };
      expect(formData.email).toBe("");
    });
  });
  