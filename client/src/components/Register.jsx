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
            <div className="flex flex-col gap-6 w-full max-w-md">
                <Card className='border-32 border-card'>
                    <CardHeader>
                        <CardTitle className="text-2xl">LLM API Performance Benchmark</CardTitle>
                        <CardDescription>
                            Create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                
                                <Button 
                                    type="submit" 
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating account...' : 'Create account'}
                                </Button>
                                
                                <div className="mt-4 text-center text-sm">
                                    Already have an account?{" "}
                                    <Link to="/login" className="underline underline-offset-4">
                                        Sign in
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 