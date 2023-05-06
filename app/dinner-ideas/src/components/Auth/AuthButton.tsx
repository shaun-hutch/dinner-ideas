import { Auth, Hub } from "aws-amplify";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthButton.css";

export interface AuthButtonProps
{
    onUserChange: (user: any) => void;
}

export const AuthButton = (props: AuthButtonProps) => {
    const navigate = useNavigate();


    const signOut = async () => {
        try {
            await Auth.signOut();
            props.onUserChange(null);
        } catch (error) {
            console.error('error signing out', error);
        }
    };

    const checkUser = async () => {
        try {
            const current = await Auth.currentAuthenticatedUser();
            props.onUserChange(current);
        } catch (error) {
            console.error('error checking user', error);
        }
    };

    React.useEffect(() => {
        checkUser();

        Hub.listen('auth', ({ payload: { event, data}}) => {
            if (event === 'signIn' || event === 'signUp') {
                props.onUserChange(data);
                navigate('/');
            } else if (event === 'signOut') {
                props.onUserChange(null);
                navigate('/signin');
            }
        });

    }, [navigate]);

    return (
        <Link to="/signin" className="sign-out" onClick={signOut}>Sign Out</Link>
    )    
};
