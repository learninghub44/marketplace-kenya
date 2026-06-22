import { redirect } from 'next/navigation'
// Onboarding is now handled inline at registration
export default function OnboardingPage() { redirect('/register') }
