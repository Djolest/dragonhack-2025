// src/components/SignupForm.tsx
"use client";

import React from "react";
import { Input, Button, Link, Spacer } from "@heroui/react";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup Submitted");
    // Add actual signup logic here
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Optional: Add Name fields */}
      {/* <Input isRequired label="Full Name" placeholder="Enter your name" variant="bordered" /> */}
      <Input
        isRequired
        label="Email"
        placeholder="Enter your email"
        type="email"
        variant="bordered"
      />
      <Input
        isRequired
        label="Password"
        placeholder="Create a password"
        type="password"
        variant="bordered"
      />
       {/* Optional: Add Confirm Password field */}
      {/* <Input isRequired label="Confirm Password" placeholder="Confirm your password" type="password" variant="bordered"/> */}

      {/* Optional: Add Terms Agreement Checkbox */}
      {/* <Checkbox isRequired classNames={{ label: "text-small", }}> I agree to the Terms & Privacy Policy </Checkbox> */}

      <Spacer y={2} />
      <Button type="submit" color="primary" variant="solid" fullWidth>
        Create Account
      </Button>
      <Spacer y={1} />
      <div className="text-center text-small text-default-500">
        Already have an account?{' '}
        <Link size="sm" onPress={onSwitchToLogin} className="cursor-pointer" color="primary">
          Log In
        </Link>
      </div>
    </form>
  );
};