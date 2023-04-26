import { useAuthenticator } from "@aws-amplify/ui-react";

// TODO STYLE THIS PROPERLY
// AND PROPER ELEMENTS
const components = {
    Header() {
  
      return (
        <div>header here</div>
      );
    },
  
    Footer() {
      return (
        <div>footer here</div>
      )
    },
  
    SignIn: {
      Header() {
  
        return (
          <div>sign in here</div>
        );
      },
      Footer() {
        const { toResetPassword } = useAuthenticator();
  
        return (
          <div>
            <button
              onClick={toResetPassword}
            >
              Reset Password
            </button>

          </div>
        );
      },
    },
  
    SignUp: {
      Header() {
  
        return (
          <div>create a new account</div>
        );
      },
      Footer() {
        const { toSignIn } = useAuthenticator();
  
        return (
            <div>
                <button
                onClick={toSignIn}
                >
                Back to Sign In
                </button>
            </div>
        );
      },
    },
    ConfirmSignUp: {
      Header() {
        return (
          <div>
            Enter information
            </div>
        );
      },
      Footer() {
        return <div>footer information</div>
      },
    },
    SetupTOTP: {
      Header() {
        return (
            <div>
                Enter Information:
            </div>
        );
      },
      Footer() {
        return <div>Footer Information</div>;
      },
    },
    ConfirmSignIn: {
      Header() {
        return (
          <div>
            Enter Information:
          </div>
        );
      },
      Footer() {
        return <div>Footer Information</div>;
      },
    },
    ResetPassword: {
      Header() {
        return (
          <div>Enter information to reset password</div>
        );
      },
      Footer() {
        return <div>Footer Information</div>;
      },
    },
    ConfirmResetPassword: {
      Header() {
        return (
            <div>
                Enter information
            </div>
        );
      },
      Footer() {
        return <div>Footer Information</div>;
      },
    },
  };
  
  const formFields = {
    signIn: {
      username: {
        placeholder: 'Enter your email',
      },
    },
    signUp: {
      password: {
        label: 'Password:',
        placeholder: 'Enter your Password:',
        isRequired: false,
        order: 2,
      },
      confirm_password: {
        label: 'Confirm Password:',
        order: 1,
      },
    },
    forceNewPassword: {
      password: {
        placeholder: 'Enter your Password:',
      },
    },
    resetPassword: {
      username: {
        placeholder: 'Enter your email:',
      },
    },
    confirmResetPassword: {
      confirmation_code: {
        placeholder: 'Enter your Confirmation Code:',
        label: 'New Label',
        isRequired: false,
      },
      confirm_password: {
        placeholder: 'Enter your Password Please:',
      },
    },
    setupTOTP: {
      QR: {
        totpIssuer: 'test issuer',
        totpUsername: 'amplify_qr_test_user',
      },
      confirmation_code: {
        label: 'New Label',
        placeholder: 'Enter your Confirmation Code:',
        isRequired: false,
      },
    },
    confirmSignIn: {
      confirmation_code: {
        label: 'New Label',
        placeholder: 'Enter your Confirmation Code:',
        isRequired: false,
      },
    },
  };

  export default function AuthComponents() {
    return {
        components,
        formFields
    };
  };