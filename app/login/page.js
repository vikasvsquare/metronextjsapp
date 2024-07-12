'use client';
import DashboardNav from '@/components/DashboardNav';
import React, { useState } from 'react';

export default function page() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginFlag, setLoginFlag] = useState(true)


    const setFormState = (flag) => {
        setLoginFlag(flag);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/v1/auth/register`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
            alert('User registered successfully');
        } else {
            alert('Registration failed');
        }
        const data = await response.json();

    };

    return (
        <>
            {/* <DashboardNav /> */}
            <div className="container relative z-10">
                <div className="lg:flex lg:gap-8">
                    <section class="bg-gray-50 dark:bg-gray-900 w-full">
                        {loginFlag ? (
                            <div class="flex flex-col items-center justify-center px-4 py-4 mx-auto md:h-screen lg:py-0">
                                <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                                        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                            Admin Login
                                        </h1>
                                        <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                            <div>
                                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    id="username"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    placeholder="Enter username"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    required=""
                                                />
                                            </div>
                                            <button type="submit" class="w-full text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Login</button>
                                            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                                                Don't have an account? <a href="#" class="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={() => setFormState(false)}>Register here</a>
                                            </p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ) : (

                            <div class="flex flex-col items-center justify-center px-4 py-4 mx-auto md:h-screen lg:py-0">
                                <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                                        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                            Create an account
                                        </h1>
                                        <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                            <div>
                                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    id="username"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    placeholder="Enter username"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="name@company.com"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    required=""
                                                />
                                            </div>
                                            <button type="submit" class="w-full text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                                            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                                                Already have an account? <a href="#" class="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={() => setFormState(true)}>Login here</a>
                                            </p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}
