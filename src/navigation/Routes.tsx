import { useStoreState } from '@/store'
import AuthStack from '@/navigation/Auth.Stack'
import MainStack from '@/navigation/Main.Stack'
import OnboardingStack from '@/navigation/Onboarding.Stack'

export default function Routes() {
	const firstTime = true
	const role = useStoreState(({ user }) => user.role)

	//? dynamically call stack per role
	// ex: const RoleStack: JSX.Element = require(`./${role.charAt(0).toUpperCase() + role.slice(1).toLowercase()}.Stack`).default

	switch (role) {
		case 'user':
			return <MainStack />
		default:
			return firstTime ? <OnboardingStack /> : <AuthStack />
	}
}