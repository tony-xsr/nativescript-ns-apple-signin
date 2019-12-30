import { Observable } from "tns-core-modules/data/observable";
import { signInWithApple, isSignInWithAppleSupported, getSignInWithAppleState } from "nativescript-ns-apple-signin";

export class HomeViewModel extends Observable {
    constructor() {
        super();
    }
    private user: string;

    isSupported(): void {
        console.log(isSignInWithAppleSupported() ? "YES" : "NO");
    }

    getSignInState(): void {
        getSignInWithAppleState(this.user)
            .then(state => console.log("Sign in state: " + state))
            .catch(err => console.log("Error getting sign in state: " + err));
    }

    signIn(): void {
        signInWithApple(
            {
                scopes: ["EMAIL"]
            })
            .then(credential => {
                console.log("Signed in, user: " + credential.user);
                console.log("Signed in, user: " + credential.email);
                console.log("Signed in, user: " + credential.fullname);
                this.user = credential.user;
            })
            .catch(err => console.log("Error signing in: " + err));
    }
}
