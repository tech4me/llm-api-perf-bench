import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import authClient from '../lib/authClient';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { refreshSession, loading: authLoading } = useAuth();

    // Get the url to redirect to after login, or default to "/"
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLocalLoading(true);

        try {
            console.log('Starting login process...');

            // Use the Better Auth method for email login
            const { data, error: authError } = await authClient.signIn.email({
                email,
                password,
                callbackURL: from,
                rememberMe: true
            });

            console.log('Sign in response:', { data, authError });

            if (authError) {
                throw new Error(authError.message || 'Authentication failed');
            }

            // Small delay to ensure server has processed the login
            await new Promise(resolve => setTimeout(resolve, 500));

            // Refresh session to update auth context
            console.log('Refreshing session after login...');
            const sessionData = await refreshSession();
            console.log('Session refresh result:', sessionData);

            if (!sessionData || !sessionData.user) {
                // If session isn't available yet, wait and try again
                console.log('Session not immediately available, retrying...');
                await new Promise(resolve => setTimeout(resolve, 1500));
                const retrySession = await refreshSession();
                console.log('Retry session result:', retrySession);

                if (!retrySession || !retrySession.user) {
                    throw new Error('Failed to establish session');
                }
            }

            // Log success and navigate to the page user tried to visit
            console.log('Authentication successful, navigating to:', from);
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Login error details:', err);
            setError(err.message || 'Invalid email or password');
        } finally {
            setLocalLoading(false);
        }
    };

    // Determine if we're in a loading state
    const isLoading = localLoading || authLoading;

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Card className="w-[25%] max-w-md mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">LLM API Performance Bench</CardTitle>
                    <CardDescription className="text-xl">Sign in to your account</CardDescription>
                </CardHeader>

                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4 w-full">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center w-full">
                            <Button
                                type="submit"
                                className="w-full max-w-xs"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}