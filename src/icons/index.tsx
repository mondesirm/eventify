import Home from '@/icons/Home'
import Chat from '@/icons/Chat'
import User from '@/icons/User'
import Search from '@/icons/Search'
import Calendar from '@/icons/Calendar'
import Category from '@/icons/Category'
import Location from '@/icons/Location'
import Discovery from '@/icons/Discovery'
import ChevronLeft from '@/icons/ChevronLeft'
import Notification from '@/icons/Notification'
import { IconlyContextProps } from '@/contexts/IconlyContext'

const Icons = {
	Home,
	Chat,
	User,
	Search,
	Calendar,
	Category,
	Location,
	Discovery,
	ChevronLeft,
	Notification
}

export default Icons

export type IconProps = {
	set?: string
	color?: string
	opacity?: string
	secondaryColor?: string
	strokeWidth?: string | number
}

export const Icon = ({ name, ...props }: { name: Lowercase<keyof typeof Icons> } & IconlyContextProps) => {
	const Icon = Icons[name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()]
	return <Icon {...props} />
}