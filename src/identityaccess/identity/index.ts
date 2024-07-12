export type SignUpCommand = Record<string, string>

export type SignInCommand = Record<string, string>


export type UserData = Record<string, string>


export interface IndetityService {
  signUp(command: SignUpCommand): Promise<UserData>;

  SignIn(command: SignInCommand): Promise<void>;
}
class Identity {
  
}