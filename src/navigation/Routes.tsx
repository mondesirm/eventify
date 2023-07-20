import AuthStack from '@/navigation/Auth.Stack'
import MainStack from '@/navigation/Main.Stack'
import OnboardingStack from '@/navigation/Onboarding.Stack'

export default function Routes({ roles = [], firstTime = true }) {
	if (roles?.length > 0) return <MainStack />
	else return firstTime ? <OnboardingStack /> : <AuthStack />
}