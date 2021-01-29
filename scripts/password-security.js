/**
   *
   * @param {string} pwd Password string to evaluate if it meets requirements
   * @return {boolean}
   */
export function passwordSecurityValid(pwd) {
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
