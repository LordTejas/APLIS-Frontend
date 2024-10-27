'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { createUser, getUserByEmailAndPassword } from '../../actions/auth';
import Tabs from '@/components/Tabs';
import Input from '@/components/Input';
import toast from 'react-hot-toast'; // Import toast

const SignInPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState(''); // Added confirm password state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate confirm password if signing up
    if (!isSignIn && password !== confirmPassword) {
      toast.error("Passwords do not match."); // Show error toast
      return;
    }

    const roles = ['STUDENT', 'TEACHER'];
    const role = roles[selectedTabIndex];

    try {
      let user;
      if (isSignIn) {
        user = await getUserByEmailAndPassword(email, password, role);
      } else {
        user = await createUser(email, username, password, role);
      }
      toast.success(isSignIn ? `Welcome back, ${user.username}!` : 'User created successfully! Please sign in.'); // Show success toast

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (err) {
      toast.error(err.message); // Show error toast
    }
  };

  const tabs = [
    {
      title: 'Students',
    },
    {
      title: 'Teachers',
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-2 min-h-screen bg-background">


      <div className="bg-white p-6 rounded shadow-md w-80 flex flex-col gap-4">
        <Tabs data={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
        {isSignIn ?
          (
            <>
              <Input
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </>
          )
          :
          ( // Conditionally render username and confirm password fields
            <>
              <Input
                id="username"
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              <Input
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              <Input
                id="confirm-password"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </>
          )}
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {isSignIn ? 'Sign In' : 'Sign Up'}
        </button>

        {
          isSignIn ? (
            <p className="mt-4 text-center">Don&apos;t have an account? <span className="text-blue-500 cursor-pointer" onClick={() => setIsSignIn(false)}>Sign up</span></p>
          ) : (
            <p className="mt-4 text-center">Already have an account? <span className="text-blue-500 cursor-pointer" onClick={() => setIsSignIn(true)}>Sign in</span></p>
          )
        }
      </div>
    </div>
  );
};

export default SignInPage;
