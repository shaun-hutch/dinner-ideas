import { Auth, Hub } from "aws-amplify";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const AuthButton = () => {

    const [user, setUser] = React.useState(null);
    const navigate = useNavigate();


    const signOut = async () => {
        try {
            await Auth.signOut();
            setUser(null);
            navigate('/signin')
        } catch (error) {
            console.error('error signing out', error);
        }
    };

    const checkUser = async () => {
        try {
            const current = await Auth.currentAuthenticatedUser();
            setUser(current);
        } catch (error) {
            console.error('error checking user', error);
        }
    };

    React.useEffect(() => {
        checkUser();

        const listener = Hub.listen('auth', ({ payload: { event, data}}) => {
            if (event === 'signIn' || event === 'signUp') {
                setUser(data);
                navigate('/');
            } else if (event === 'signOut') {
                setUser(null);
            }
        });

        return () => listener();
    }, [navigate]);

    return (
        user ? (
            <Link to="/signin" onClick={signOut}>Sign Out</Link>
        ) : (
            <Link to="/signIn">Sign In</Link>
        )
    )    
};
