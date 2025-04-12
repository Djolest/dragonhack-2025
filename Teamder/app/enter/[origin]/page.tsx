'use client';

import {Form} from "@heroui/form";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function LogIn() {
  const params = useParams();
  const dynamicValue = params.origin === "login" ? "Log In" : "Sign Up";

  const [errors, setErrors] = useState({});

  const onSubmit = (e:any) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    
    // Handle form submission and validation
    // Set errors if needed: setErrors({ username: 'Invalid username' });
  };
  return (
    <div>
      <h1>{dynamicValue}</h1>
      {/** I want 2 slide for Sing up and log in */}
      <Form 
      className="w-full max-w-xs flex flex-col gap-3"
      validationErrors={errors}
      onSubmit={onSubmit}
    >
      <Input
        label="Username"
        labelPlacement="outside"
        name="username"
        placeholder="Enter your username"
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
