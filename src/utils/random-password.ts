export function generateRandomPassword() {
  const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const specialCharacters = '!@#$%^&*()_+[]{}|;:,.<>?'

  // Bitta katta harf
  const randomUpperCase =
    upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)]

  // Bitta kichik harf
  const randomLowerCase =
    lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)]

  // Bitta son
  const randomDigit = numbers[Math.floor(Math.random() * numbers.length)]

  // Bitta simvol
  const randomSpecialChar =
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)]

  // Qolgan 4 ta belgi
  const randomChars = upperCaseLetters + lowerCaseLetters + numbers + specialCharacters
  let randomPassword = ''
  for (let i = 0; i < 4; i++) {
    randomPassword += randomChars[Math.floor(Math.random() * randomChars.length)]
  }

  // Barcha belgilar biriktirilgan parol
  const password =
    randomUpperCase + randomLowerCase + randomDigit + randomSpecialChar + randomPassword

  return password
}
