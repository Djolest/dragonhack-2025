// src/components/LoginForm.tsx
"use client";

import React from "react";
import { Input, Button, Link, Spacer } from "@heroui/react";
// Optional: Import icons if desired
// import { MailIcon } from './MailIcon';
// import { LockIcon } from './LockIcon';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login Submitted");
    // Add actual login logic here
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        isRequired
        label="Email"
        placeholder="Enter your email"
        type="email"
        variant="bordered"
        // startContent={<MailIcon className="text-default-400 pointer-events-none flex-shrink-0" />}
      />
      <Input
        isRequired
        label="Password"
        placeholder="Enter your password"
        type="password"
        variant="bordered"
        // startContent={<LockIcon className="text-default-400 pointer-events-none flex-shrink-0" />}
      />
      <div className="flex py-1 px-1 justify-between">
        {/* Optional: Add Checkbox for remember me */}
        {/* <Checkbox classNames={{ label: "text-small", }}> Remember me </Checkbox> */}
        <Link color="primary" href="#" size="sm">
          Forgot password?
        </Link>
      </div>
      <Spacer y={2} />
      <Button type="submit" color="primary" variant="solid" fullWidth>
        Log In
      </Button>
      <Spacer y={1} />
       <div className="text-center text-small text-default-500">
        Need an account?{' '}
        <Link size="sm" onPress={onSwitchToSignup} className="cursor-pointer" color="primary">
          Sign Up
        </Link>
      </div>
    </form>
  );
};