import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import "./Auth.css";

const Login: React.FC = () => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            if (isRegister) {
                await register(email, password);
            } else {
                await login(email, password);
            }
            navigate("/");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An error occurred";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Card title={isRegister ? "Create Account" : "Sign In"} className="auth-card">
                <form onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <FloatLabel>
                            <InputText
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="auth-input"
                            />
                            <label htmlFor="email">Email</label>
                        </FloatLabel>
                    </div>
                    <div className="auth-field">
                        <FloatLabel>
                            <Password
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                feedback={isRegister}
                                toggleMask
                                className="auth-input"
                            />
                            <label htmlFor="password">Password</label>
                        </FloatLabel>
                    </div>
                    {error && <div className="auth-error">{error}</div>}
                    <div className="auth-buttons">
                        <Button
                            type="submit"
                            label={isRegister ? "Register" : "Sign In"}
                            icon={`pi ${loading ? "pi-spin pi-spinner" : "pi-sign-in"}`}
                            disabled={loading}
                            raised
                        />
                    </div>
                    <div className="auth-toggle">
                        <Button
                            type="button"
                            link
                            label={isRegister ? "Already have an account? Sign in" : "Don't have an account? Register"}
                            onClick={() => { setIsRegister(!isRegister); setError(""); }}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Login;
