import { useStoreState } from '@/store'
import AuthStack from '@/navigation/Auth.Stack'
import MainStack from '@/navigation/Main.Stack'
import OnboardingStack from '@/navigation/Onboarding.Stack'

export default function Routes() {
	const firstTime = true
	const roles = useStoreState(({ user }) => user.roles)

	if (roles.length > 0) return <MainStack />
	else return firstTime ? <MainStack /> : <AuthStack />
}