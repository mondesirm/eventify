import { MaterialCommunityIcons } from '@expo/vector-icons'

import Icons from '@/icons'

export const iconly = (name: Lowercase<keyof typeof Icons>) => name
export const material = (name: keyof typeof MaterialCommunityIcons.glyphMap) => name

export default function icon<T extends 'iconly' | 'material' = 'material'>(
    name: T extends 'iconly' ? Parameters<typeof iconly>[0] : Parameters<typeof material>[0]) {
    return name
}