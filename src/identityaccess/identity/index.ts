export type SignUpCommand = Record<string, string>

export type SignInCommand = Record<string, string>


export type UserData = Record<string, string>


export interface IdentityService {
  signUp(command: SignUpCommand): Promise<UserData>;

  SignIn(command: SignInCommand): Promise<void>;
}
class DefaultIdentityService implements IdentityService {

  async signUp(command: SignUpCommand): Promise<UserData> {
    throw new Error("Method not implemented.");
  }
  
  async SignIn(command: SignInCommand): Promise<void> {
    throw new Error("Method not implemented.");
  }
  
  
}