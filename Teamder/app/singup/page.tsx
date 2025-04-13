'use client';

import {Form} from "@heroui/form";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import { useState } from "react";
import { FormEvent } from "react";
import { register } from "@/app/lib/db/appwrite";
import { useRouter } from 'next/navigation';

export default function SingUp() {
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(0);
  const [userID, setUserID] = useState("");
  const router = useRouter();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    console.log("Pozvan onSubmit")
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    
    // Handle form submission and validation
    // Set errors if needed: setErrors({ username: 'Invalid username' });
    const { username, email, password } = data;
    console.log(username, email, password);
    register(username, email, password, setSuccess, setUserID);
    setTimeout(() => {}, 200);
    if (userID.length > 0) {
      console.log("User ID: ", userID);
      // Redirect to the login page after successful registration
      router.push(`/dashboard/${userID}`);
    }
  }
  
  return (
    <div>
      <h1>Sing up</h1>
      {/** I want 2 slide for Sing up and log in */}
      <Form 
      className="w-full max-w-xs flex flex-col gap-3"
      validationErrors={errors}
      onSubmit={onSubmit}
    >
      <Input
        label="username"
        labelPlacement="outside"
        name="username"
        placeholder="Enter your username"
        isRequired
      />
      <Input
        label="email"
        labelPlacement="outside"
        name="email"
        placeholder="Enter your email"
        isRequired
      />
      <Input
        label="password"
        labelPlacement="outside"
        name="password"
        type="password"
        placeholder="Enter your password"
        isRequired
      />
      <Button type="submit" color="primary">
        Sing Up
      </Button>
    </Form>
    {success == 200 ? <p>Registration successful!</p> : null} 
    {success == 400 ? <p>Registration failed. Please try again.</p> : null}
    </div>
  );
}
