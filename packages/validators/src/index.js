// verify if given EMAIL address is valid or not
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

// verify if given NAME has one space between the firstname and lastname
export function hasOneSpaceBetweenNames(name) {
  const nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
  return nameRegex.test(name);
}

// verify if given PHONENUMBER is valid or not
export function isValidIndianMobileNumber(mobileNumber) {
  // const indianMobileNumberRegex = /^(\+91-|\+91|0|91)?[6-9]\d{9}$/;
  const indianMobileNumberRegex = /^[6-9]\d{9}$/;
  return indianMobileNumberRegex.test(mobileNumber);
}

export function generateRandomCode() {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number

  const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomCode.toString();
}

export function isValidUrl(url) {
  // Basic regex pattern (can be customized based on your requirements)
  const urlRegex =
    /^((http|https|ftp):\/\/)?[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,6}$/;

  return urlRegex.test(url);
}
