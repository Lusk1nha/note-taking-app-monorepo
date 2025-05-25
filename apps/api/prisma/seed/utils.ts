export function randomAdminEmail() {
	const randomEmail = Math.random().toString(36).substring(2, 15) + '@admin.com'
	return randomEmail
}
