/**
 * In-memory flag: true after user completes onboarding in this app session.
 * Resets when the app is restarted, so onboarding is shown again next time.
 */
let completedThisSession = false;

export function setOnboardingCompletedThisSession(value: boolean) {
  completedThisSession = value;
}

export function hasCompletedOnboardingThisSession() {
  return completedThisSession;
}
