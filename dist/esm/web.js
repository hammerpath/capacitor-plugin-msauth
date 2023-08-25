import { PublicClientApplication } from '@azure/msal-browser';
import { WebPlugin } from '@capacitor/core';
export class MsAuth extends WebPlugin {
    async login(options) {
        const context = this.createContext(options);
        try {
            return await this.acquireTokenSilently(context, options.scopes).catch(() => this.acquireTokenInteractively(context, options.scopes));
        }
        catch (error) {
            console.error('MSAL: Error occurred while logging in', error);
            throw error;
        }
    }
    logout(options) {
        const context = this.createContext(options);
        if (!context.getAllAccounts()[0]) {
            return Promise.reject(new Error('Nothing to sign out from.'));
        }
        else {
            return context.logoutPopup();
        }
    }
    createContext(options) {
        var _a, _b, _c;
        const config = {
            auth: {
                clientId: options.clientId,
                domainHint: options.domainHint,
                authority: (_a = options.authorityUrl) !== null && _a !== void 0 ? _a : `https://login.microsoftonline.com/${(_b = options.tenant) !== null && _b !== void 0 ? _b : 'common'}`,
                knownAuthorities: options.knownAuthorities,
                redirectUri: (_c = options.redirectUri) !== null && _c !== void 0 ? _c : this.getCurrentUrl(),
            },
            cache: {
                cacheLocation: 'localStorage',
            },
        };
        return new PublicClientApplication(config);
    }
    getCurrentUrl() {
        return window.location.href.split(/[?#]/)[0];
    }
    async acquireTokenInteractively(context, scopes) {
        const { accessToken, idToken } = await context.acquireTokenPopup({
            scopes,
            prompt: 'select_account',
        });
        return { accessToken, idToken, scopes };
    }
    async acquireTokenSilently(context, scopes) {
        const { accessToken, idToken } = await context.acquireTokenSilent({
            scopes,
            account: context.getAllAccounts()[0],
        });
        return { accessToken, idToken, scopes };
    }
}
//# sourceMappingURL=web.js.map