export function generateRandomString(length) {
    const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * symbols.length);
      randomString += symbols.charAt(randomIndex);
    }
  
    return randomString;
}