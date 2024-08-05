'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginFlag, setLoginFlag] = useState(true)
    const router = useRouter();

    const setFormState = (flag) => {
        setLoginFlag(flag);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email, password);
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password
        });
        if (!result.error) {
          // Redirect to a protected page or refresh the page
          router.push('/');
        } else {
          // Handle login error
          console.error(result.error);
        }
      };

    return (
        <>
            <div className="container relative z-10">
                <div className="lg:flex lg:gap-8">
                    <section className="bg-gray-5 w-full">
                        {loginFlag ? (
                            <div className="flex flex-col items-center justify-center px-4 py-4 mx-auto md:h-screen lg:py-0">
                                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                                            SSLE Admin Login
                                        </h1>
                                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                            <div>
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    email
                                                </label>
                                                <input
                                                    type="text"
                                                    name="email"
                                                    id="email"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter Email"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    required=""
                                                />
                                            </div>
                                            <button type="submit" className="w-full text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Login</button>
                                            {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                                Don't have an account? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={() => setFormState(false)}>Register here</a>
                                            </p> */}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ) : (

                            <div className="flex flex-col items-center justify-center px-4 py-4 mx-auto md:h-screen lg:py-0">
                                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                            Create an account
                                        </h1>
                                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                            <div>
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    id="username"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    placeholder="Enter username"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="name@company.com"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    required=""
                                                />
                                            </div>
                                            <button type="submit" className="w-full text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                                Already have an account? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={() => setFormState(true)}>Login here</a>
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
