/**
   *
   * @param {string} pwd Password string to evaluate if it meets requirements
   * @return {boolean}
   */
export function passwordSecurityValid(pwd) {
  // Enforcement principles should be a js object
  // { captialLetters: true or false }
  // { specialCharacters: true or false }
  // { numberRequired: true or false }
  const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;
  return regEx.test(pwd);
}

/**
 * Return true if pwd1 === pwd2. Used for checking password security on the front end
 * @param {string} pwd1
 * @param {string} pwd2
 * @return {boolean}
 */
export function passwordsMatch(pwd1, pwd2) {
  return pwd1 === pwd2;
}
