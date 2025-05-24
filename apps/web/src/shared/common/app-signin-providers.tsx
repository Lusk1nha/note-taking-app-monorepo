import { RedirectToGoogleSigninAction } from '@/components/actions/redirect-to-google-signin-action'

export enum AppSignInProviders {
	Google = 'google',
	Github = 'github',
}

export const appSignInComponentsMap = {
	[AppSignInProviders.Google]: {
		component: RedirectToGoogleSigninAction,
		label: 'Google',
	},
	[AppSignInProviders.Github]: {
		component: RedirectToGoogleSigninAction,
		label: 'Github',
	},
}
