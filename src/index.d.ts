import { Common } from './ns-apple-signin.common';
export declare class NsAppleSignin extends Common {
  // define your typings manually
  // or..
  // take the ios or android .d.ts files and copy/paste them here
}
export type SignInWithAppleScope = "EMAIL" | "FULLNAME";

export type SignInWithAppleState = "AUTHORIZED" | "NOTFOUND" | "REVOKED";

export declare interface SignInWithAppleOptions {
  user?: string;
  scopes?: Array<SignInWithAppleScope>;
}
//NSPersonNameComponents
export declare interface NSPersonNameApple {
  givenName: string;
  familyName: string;
  middleName: string;
  namePrefix: string;
  nameSuffix: string;
  nickname: string;
  phoneticRepresentation: string;
}
export declare interface SignInWithAppleCredentials {
  user: string;
  email: string;
  realUserStatus: string;
  identityToken: any;
  authCode: any;
  fullName: any ;
  // scopes: Array<SignInWithAppleScope>;
}

export declare function isSignInWithAppleSupported(): boolean;

export declare function getSignInWithAppleState(user: string): Promise<SignInWithAppleState>;

export declare function signInWithApple(options?: SignInWithAppleOptions): Promise<SignInWithAppleCredentials>;