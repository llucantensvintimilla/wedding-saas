import Cookies from 'js-cookie';

export const REFERRAL_COOKIE_NAME = 'ow_referral';

/**
 * Saves the referral code to a cookie.
 * @param code The referral code (e.g., 'SARAH')
 */
export function setReferralCode(code: string) {
  // Set cookie for 30 days
  Cookies.set(REFERRAL_COOKIE_NAME, code, { expires: 30 });
}

/**
 * Retrieves the referral code from the cookie.
 * @returns The referral code or null if not found.
 */
export function getReferralCode(): string | null {
  return Cookies.get(REFERRAL_COOKIE_NAME) || null;
}

/**
 * Clears the referral cookie.
 */
export function clearReferralCode() {
  Cookies.remove(REFERRAL_COOKIE_NAME);
}
