export function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function isValidImage(image) {
  const { type } = image;
  return (
    type.toLowerCase() === "image/png" ||
    type.toLowerCase() === "image/jpg" ||
    type.toLowerCase() === "image/jpeg" ||
    type.toLowerCase() === "image/webp" ||
    type.toLowerCase() === "image/gif"
  );
}

export function isValidPassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
}

export function hasOneSpaceBetweenNames(name) {
  const nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
  return nameRegex.test(name);
}

export function isValidIndianMobileNumber(mobileNumber) {
  const indianMobileNumberRegex = /^[6-9]\d{9}$/;
  return indianMobileNumberRegex.test(mobileNumber);
}

export function generateRandomCode() {
  const min = 1000; // Minimum 6-digit number
  const max = 9999; // Maximum 6-digit number

  const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomCode.toString();
}

export function isValidUrl(url) {
  // Basic regex pattern (can be customized based on your requirements)
  const urlRegex =
    /^((http|https|ftp):\/\/)?[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,6}$/;

  return urlRegex.test(url);
}

export function isValid4DigitOtp(value) {
  const otpRegex = /^\d{4}$/;
  return otpRegex.test(value);
}
