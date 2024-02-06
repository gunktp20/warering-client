const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export function validateEmail(ch: string): boolean {
  if (ch && ch.match(isValidEmail)) {
    return false;
  } else {
    return true;
  }
}
