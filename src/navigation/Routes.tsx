import AuthStack from './Auth.Stack'
import OnboardingStack from './Onboarding.Stack'

export default function Routes() {
	const user = false
	const role = 'intro'
	const firstTime = true
	// const RoleStack: JSX.Element = require(`./${role.charAt(0).toUpperCase() + role.slice(1)}.Stack`).default

	// if (user) return RoleStack
	if (firstTime) return <OnboardingStack />
	return <AuthStack />
}