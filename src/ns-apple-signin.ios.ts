import { Common } from './ns-apple-signin.common';
import { device } from "tns-core-modules/platform";
import { ios as iOSUtils } from "tns-core-modules/utils/utils";
import { SignInWithAppleCredentials, SignInWithAppleOptions, SignInWithAppleState, NSPersonNameApple } from "./index";
import jsArrayToNSArray = iOSUtils.collections.jsArrayToNSArray;
const appSettings = require("tns-core-modules/application-settings");

let controller: any /* ASAuthorizationController */;
let delegate: ASAuthorizationControllerDelegateImpl;

declare const ASAuthorizationAppleIDProvider, ASAuthorizationController, ASAuthorizationControllerDelegate,
    ASAuthorizationScopeEmail, ASAuthorizationScopeFullName: any;

export function isSignInWithAppleSupported(): boolean {
  return parseInt(device.osVersion) >= 13;
}

export function getSignInWithAppleState(user: string): Promise<SignInWithAppleState> {
  return new Promise<any>((resolve, reject) => {
    if (!user) {
      reject("The 'user' parameter is mandatory");
      return;
    }

    if (!isSignInWithAppleSupported()) {
      reject("Not supported");
      return;
    }

    const provider = ASAuthorizationAppleIDProvider.new();
    provider.getCredentialStateForUserIDCompletion(user, (state: any /* enum: ASAuthorizationAppleIDProviderCredentialState */, error: NSError) => {
      if (error) {
        reject(error.localizedDescription);
        return;
      }

      if (state === 1) { // ASAuthorizationAppleIDProviderCredential.Authorized
        resolve("AUTHORIZED");
      } else if (state === 2) { // ASAuthorizationAppleIDProviderCredential.NotFound
        resolve("NOTFOUND");
      } else if (state === 3) { // ASAuthorizationAppleIDProviderCredential.Revoked
        resolve("REVOKED");
      } else {
        // this prolly means a state was added so we need to add it to the plugin
        reject("Invalid state for getSignInWithAppleState: " + state + ", please report an issue at he plugin repo!");
      }
    });
  });
}

export function signInWithApple(options?: SignInWithAppleOptions): Promise<SignInWithAppleCredentials> {
  return new Promise<any>((resolve, reject) => {
    if (!isSignInWithAppleSupported()) {
      reject("Not supported");
      return;
    }
    const provider = ASAuthorizationAppleIDProvider.new();
    const request = provider.createRequest();
    //const request = ASAuthorizationAppleIDProvider().createRequest();

    if (options && options.user) {
      request.user = options.user;
    }

    if (options && options.scopes) {
      const nsArray = NSMutableArray.new();
      options.scopes.forEach(s => {
        if (s === "EMAIL") {
          nsArray.addObject(ASAuthorizationScopeEmail);
        } else if (s === "FULLNAME") {
          nsArray.addObject(ASAuthorizationScopeFullName);
        } else {
          console.log("Unsupported scope: " + s + ", use either EMAIL or FULLNAME");
        }
      });
      request.requestedScopes = nsArray;
    }

    controller = ASAuthorizationController.alloc().initWithAuthorizationRequests(jsArrayToNSArray([request]));
    controller.delegate = delegate = ASAuthorizationControllerDelegateImpl.createWithPromise(resolve, reject);
    controller.performRequests();
  });
}

class ASAuthorizationControllerDelegateImpl extends NSObject /* implements ASAuthorizationControllerDelegate */ {
  public static ObjCProtocols = [];
  private resolve;
  private reject;

  public static new(): ASAuthorizationControllerDelegateImpl {
    try {
      ASAuthorizationControllerDelegateImpl.ObjCProtocols.push(ASAuthorizationControllerDelegate);
      return <ASAuthorizationControllerDelegateImpl>super.new();
    } catch (ignore) {
      console.log("Apple Sign In not supported on this device - it requires iOS 13+. Tip: use 'isSignInWithAppleSupported' before calling 'signInWithApple'.");
      return null;
    }
  }

  public static createWithPromise(resolve, reject): ASAuthorizationControllerDelegateImpl {
    const delegate = <ASAuthorizationControllerDelegateImpl>ASAuthorizationControllerDelegateImpl.new();
    if (delegate === null) {
      reject("Not supported");
    } else {
      delegate.resolve = resolve;
      delegate.reject = reject;
    }
    return delegate;
  }
  /** Caching Data User Info with Sigin Apple . Because for the next time you'll can't get Email or Full Name */
  created(authorization: any /*ASAuthorizationAppleIDCredential*/ ) {
      if (authorization.user != null || authorization.user !== undefined) {
        let apple_auth_info = appSettings.getString(authorization.user);
        if (apple_auth_info == null) {
            appSettings.setString(authorization.user, JSON.stringify(authorization));
            return JSON.stringify( authorization);
        }
        return apple_auth_info;
      }
      return {};
  }
  authorizationControllerDidCompleteWithAuthorization(controller: any /* ASAuthorizationController */, authorization: any /* ASAuthorization */): void {
    // these properties don't seem useful for now
    const authCode = NSString.alloc().initWithDataEncoding(authorization.credential.authorizationCode, NSUTF8StringEncoding).toString();
      //NSString.alloc().initWithDataEncoding(nsData, NSUTF8StringEncoding);
    const identityToken = NSString.alloc().initWithDataEncoding(authorization.credential.identityToken, NSUTF8StringEncoding).toString();
    // TODO return granted scopes
    if (authorization.credential.email != null && authorization.credential.email !== undefined) {
        this.created(<SignInWithAppleCredentials>{
            user: authorization.credential.user,
            email: authorization.credential.email,
            realUserStatus: authorization.credential.realUserStatus,
            identityToken: identityToken,
            fullName: <NSPersonNameApple>{
                givenName: authorization.credential.fullName.givenName,
                familyName: authorization.credential.fullName.familyName,
                middleName: authorization.credential.fullName.middleName,
                namePrefix: authorization.credential.fullName.namePrefix,
                nameSuffix: authorization.credential.fullName.nameSuffix,
                nickname: authorization.credential.fullName.nickname,
                phoneticRepresentation: authorization.credential.fullName.phoneticRepresentation
            },
            authCode: authCode
            // scopes: authorization.credential.authorizedScopes // nsarray<asauthorizationscope>
        });
        this.resolve(<SignInWithAppleCredentials>{
            user: authorization.credential.user ,
            email: authorization.credential.email,
            fullName: <NSPersonNameApple>{
                givenName: authorization.credential.fullName.givenName,
                familyName: authorization.credential.fullName.familyName,
                middleName: authorization.credential.fullName.middleName,
                namePrefix: authorization.credential.fullName.namePrefix,
                nameSuffix: authorization.credential.fullName.nameSuffix,
                nickname: authorization.credential.fullName.nickname,
                phoneticRepresentation: authorization.credential.fullName.phoneticRepresentation
            },
            realUserStatus: authorization.credential.realUserStatus,
            identityToken: identityToken,
            authCode: authCode
            // scopes: authorization.credential.authorizedScopes // nsarray<asauthorizationscope>
        });
    } else {
       let userInfoInJson =  this.created(<SignInWithAppleCredentials>{
            user: authorization.credential.user,
            email: authorization.credential.email,
            realUserStatus: authorization.credential.realUserStatus,
            fullName: <NSPersonNameApple>{
                givenName: authorization.credential.fullName.givenName,
                familyName: authorization.credential.fullName.familyName,
                middleName: authorization.credential.fullName.middleName,
                namePrefix: authorization.credential.fullName.namePrefix,
                nameSuffix: authorization.credential.fullName.nameSuffix,
                nickname: authorization.credential.fullName.nickname,
                phoneticRepresentation: authorization.credential.fullName.phoneticRepresentation
            },
            identityToken: identityToken,
            authCode: authCode
            // scopes: authorization.credential.authorizedScopes // nsarray<asauthorizationscope>
        });
        //console.log("xxx" + JSON.stringify(userInfoInJson));
        this.resolve(<SignInWithAppleCredentials>{
          user: authorization.credential.user,
          email: authorization.credential.email,
          realUserStatus: authorization.credential.realUserStatus,
          fullName: <NSPersonNameApple>{
              givenName: authorization.credential.fullName.givenName,
              familyName: authorization.credential.fullName.familyName,
              middleName: authorization.credential.fullName.middleName,
              namePrefix: authorization.credential.fullName.namePrefix,
              nameSuffix: authorization.credential.fullName.nameSuffix,
              nickname: authorization.credential.fullName.nickname,
              phoneticRepresentation: authorization.credential.fullName.phoneticRepresentation
          },
          identityToken: identityToken,
          authCode: authCode
          // scopes: authorization.credential.authorizedScopes // nsarray<asauthorizationscope>
      });
        return ;
    }
  }

  authorizationControllerDidCompleteWithError(controller: any /* ASAuthorizationController */, error: NSError): void {
    this.reject(error.localizedDescription);
  }
}

export class NsAppleSignin extends Common {

}
