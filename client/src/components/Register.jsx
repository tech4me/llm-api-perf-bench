import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authClient from '../lib/authClient';
import { useAuth } from '../lib/AuthContext';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { refreshSession } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Use the Better Auth method for email registration
            const { data, error: authError } = await authClient.signUp.email({
                email,
                password,
                name,
                callbackURL: "/"
            });

            if (authError) {
                throw new Error(authError.message || 'Registration failed');
            }

            // Refresh session to update auth context
            const sessionData = await refreshSession();

            if (!sessionData || !sessionData.user) {
                // If session isn't available yet, wait a bit and try again
                await new Promise(resolve => setTimeout(resolve, 1000));
                const retrySession = await refreshSession();

                if (!retrySession || !retrySession.user) {
                    throw new Error('Failed to establish session');
                }
            }

            // Log success and navigate to home page
            console.log('Registration successful, navigating to home');
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message || 'Registration failed');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Card className="w-[25%] max-w-md mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">LLM API Performance Bench</CardTitle>
                    <CardDescription className="text-xl">Create your account</CardDescription>
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
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="w-full"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

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
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="w-full"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center w-full">
                            <Button
                                type="submit"
                                className="w-full max-w-xs"
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Create account'}
                            </Button>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
} 