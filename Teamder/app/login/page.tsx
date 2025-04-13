'use client';

import {Form} from "@heroui/form";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import { useState } from "react";
import { useUser } from "@/store/Context";



export default function LogIn() {
  const [errors, setErrors] = useState({});
  const { userID, setUserID } = useUser();
  console.log(userID);
  const onSubmit = (e:any) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log(userID);
    setUserID(200);
    // setUserID(200);
    // Handle form submission and validation
    // Set errors if needed: setErrors({ username: 'Invalid username' });
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
        label="Email"
        labelPlacement="outside"
        name="Email"
        placeholder="Enter your email"
        isRequired
      />
      <Input
        label="Password"
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
    </div>
  );
}

