export const logDebug = (component: string, color: string, ...args: any) => {
	console.log(`%c[${component}]`, `color:${color}`, ...args)
}
