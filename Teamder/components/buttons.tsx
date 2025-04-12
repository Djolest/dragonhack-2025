'use client'
import { Button } from "@heroui/button";
import { redirect } from "next/navigation";

export default function Buttons() {
  return (
    <div className="flex gap-4">
      <Button color="primary" variant="flat" size="lg" onPress={() => {redirect("/login")}}>
        Log In
      </Button>
      <Button color="primary" variant="flat" size="lg" onPress={() => {redirect("/singup")}}>
        Sing Up
      </Button>
    </div>
  );
}