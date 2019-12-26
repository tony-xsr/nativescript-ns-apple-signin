# nativescript-ns-apple-signin

# [Sign in with Apple](https://developer.apple.com/sign-in-with-apple/), for NativeScript
My Linked https://www.linkedin.com/in/tungtranuit/
#  Easily way to get User Info with Login Apple .
You can get the Infomations : 
User, Email, RealUserStatus, IdentityToken, AuthCode , fullName (givenName,familyName ,middleName, namePrefix,nameSuffix,nickname,phoneticRepresentation )  ...

```shell
{
    user: user ,
    email: email,
    fullName:{
                givenName 
                familyName 
                middleName 
                namePrefix 
                nameSuffix 
                nickname
                phoneticRepresentation 
     },
            realUserStatus: realUserStatus,
            identityToken: identityToken,
            authCode: authCode
  }
  ```
  
Re-wirte Plugin from https://github.com/EddyVerbruggen/nativescript-apple-sign-in.

## Prerequisites / Requirements

Go to the [Apple developer website](https://developer.apple.com/account/resources/identifiers/list) and create a new app identifier with the "Sign In with Apple" Capability enabled. Make sure you sign your app with a provisioning profile using that app identifier.
Open your app's App_Resources/iOS folder and add this (or append) to a file named app.entitlements.

```shell
<key>com.apple.developer.applesignin</key>
<array>
<string>Default</string>
 </array>
 ```

## Installation

```javascript
tns plugin add nativescript-ns-apple-signin
```
## Configuration


## Usage 
 
	
```javascript
tns plugin add nativescript-ns-apple-signin
```

## API

### `isSignInWithAppleSupported`

Sign In with Apple was added in iOS 13, so make sure to call this function before showing a "Sign In with Apple" button in your app.
On iOS < 13 and Android this will return `false`.

```typescript
import { isSignInWithAppleSupported } from "nativescript-ns-apple-signin";

const supported: boolean = isSignInWithAppleSupported();
```

### `signInWithApple`

Not that you know "Sign In with Apple" is supported on this device, you can have the
user sign themself in (after they pressed a nice button for instance).

```typescript
import { signInWithApple } from "nativescript-ns-apple-signin";

signInWithApple(
            {
                scopes: ["EMAIL","FULLNAME"]
            })
            .then(credential => {
                console.log("Signed in, user: " + credential.user);
                console.log("Signed in, user: " + credential.email);
                console.log("Signed in, user: " + JSON.stringify(credential.fullName));
                this.user = credential.user;
            })
            .catch(err => console.log("Error signing in: " + err));
```

### `getSignInWithAppleState`

If you want to know the current Sign In status of your user, you can pass the `user` (id) you acquired previously.

```typescript
import { getSignInWithAppleState } from "nativescript-apple-sign-in";

const user: string = "the id you got back from the signInWithApple function";

getSignInWithAppleState(user)
    .then(state => console.log("Sign in state: " + state))
    .catch(err => console.log("Error getting sign in state: " + err));
```
## License

Apache License Version 2.0, January 2004
