export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

export function isValidName(name) {
  return typeof name === 'string' && name.trim().length > 0;
}

export function isValidDate(date) {
  // Expects DD/MM/AAAA
  return /^\d{2}\/\d{2}\/\d{4}$/.test(date);
}

export function isValidWeight(value) {
  const n = parseFloat(value);
  return !isNaN(n) && n >= 30 && n <= 300;
}

export function isValidHeight(value) {
  const n = parseFloat(value);
  return !isNaN(n) && n >= 100 && n <= 250;
}

export function isValidAge(value) {
  const n = parseInt(value, 10);
  return !isNaN(n) && n >= 14 && n <= 80;
}

export function isValidBodyFat(value) {
  if (!value) return true; // optional
  const n = parseFloat(value);
  return !isNaN(n) && n >= 3 && n <= 60;
}
