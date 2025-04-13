'use client';

import {Form} from "@heroui/form";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import { useState } from "react";
import { FormEvent } from "react";
import { login } from "@/app/lib/db/appwrite";
import { useRouter } from 'next/navigation';



export default function LogIn() {
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(0);
  const [userID, setUserID] = useState("");
  const router = useRouter();
  const onSubmit = (e:any) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    
    const { email, password } = data;
    console.log(email, password);
    login(email, password, setSuccess, setUserID);
    setTimeout(() => {}, 5000);
    if (userID.length > 0) {
      console.log("User ID: ", userID);
      // Redirect to the login page after successful registration
      router.push(`/dashboard/${userID}`);
    }
  };
  return (
    <div>
      <h1>Log in</h1>
      {/** I want 2 slide for Sing up and log in */}
      <Form 
      className="w-full max-w-xs flex flex-col gap-3"
      validationErrors={errors}
      onSubmit={onSubmit}
    >
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
        Log In
      </Button>
    </Form>
    {success == 200 ? <p>Log in successful!</p> : null} 
    {success == 400 ? <p>Log in failed. Please try again.</p> : null}
    </div>
  );
}

