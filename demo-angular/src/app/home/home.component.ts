import { Component, OnInit } from "@angular/core";

import { signInWithApple, isSignInWithAppleSupported, getSignInWithAppleState } from "nativescript-ns-apple-signin";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        console.log("xxxx")
        // Init your component properties here.
    }
    private user: string;

    isSupported() {
        console.log(isSignInWithAppleSupported() ? "YES" : "NO");
        return isSignInWithAppleSupported() ;
    }

    getSignInState(): void {
        getSignInWithAppleState(this.user)
            .then(state => console.log("Sign in state: " + state))
            .catch(err => console.log("Error getting sign in state: " + err));
    }

    signIn(): void {
        signInWithApple(
            {
                scopes: ["EMAIL","FULLNAME"]
            })
            .then(credential => {
                console.log("====: " + JSON.stringify(credential));
                console.log("Signed in, user: authCode" + JSON.stringify(credential.authCode));
                console.log("Signed in, user: " + credential.email);
                console.log("Signed in, user: " + JSON.stringify(credential.fullName));
                this.user = credential.user;
            })
            .catch(err => console.log("Error signing in: " + err));
    }
}
