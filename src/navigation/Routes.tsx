import AuthStack from './Auth.Stack'
import MainStack from './Main.Stack'
import OnboardingStack from './Onboarding.Stack'

export default function Routes() {
	const user = false
	const role = 'intro'
	const firstTime = true

	// TODO firebase auth + stack per role
	// ex: const RoleStack: JSX.Element = require(`./${role.charAt(0).toUpperCase() + role.slice(1)}.Stack`).default

	if (user) return <MainStack />
	if (firstTime) return <OnboardingStack />
	return <AuthStack />
}