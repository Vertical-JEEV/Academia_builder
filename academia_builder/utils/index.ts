import continueSocialAuth from "./continue-social-auth";

export const continueGoogleAuth = () => () => continueSocialAuth('google-oauth2', 'google');

export const continueMicrosoftAuth = () => () => continueSocialAuth('microsoft-graph', 'microsoft');
