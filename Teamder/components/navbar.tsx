'use client';
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link // Import Link for potential future use
} from "@heroui/react";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation"; // Import usePathname for path checking

export default function NavbarCustom(){
  //const isOnDashboard = false; // Replace with actual logic to determine if on dashboard
  const isOnDashboard = usePathname() === "/dashboard"; // Example of how to check if on dashboard
  return (
    <div>
      { isOnDashboard ?
      <Navbar isBordered maxWidth="xl">
        <NavbarContent justify="start">
          <NavbarItem>
            <Button color="primary" variant="flat" size="lg" onPress={() => {redirect("/login")}}>
              Redo Questionare
            </Button>
          </NavbarItem>
        </NavbarContent>
        
          <NavbarBrand className="justify-center">
            <Link className="font-bold text-inherit text-lg" href="/dashboard">Teamder</Link>
          </NavbarBrand>


        <NavbarContent justify="end">
          <NavbarItem>
            <Button color="primary" variant="flat" size="lg" onPress={() => {redirect("/login")}}>
              Copy Link
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      :
      <Navbar isBordered maxWidth="xl">
        <NavbarBrand>
          {/* <AcmeLogo /> You could place a logo component here */}
          <Link className="font-bold text-inherit text-lg" href="/">Teamder</Link>
        </NavbarBrand>

        {/* Optional: Add center content later if needed */}
        {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="#">Features</Link>
          </NavbarItem>
        </NavbarContent> */}

        <NavbarContent justify="end">
          <NavbarItem>
                <Button color="primary" variant="flat" size="lg" onPress={() => {redirect("/login")}}>
                  Log In
                </Button>
          </NavbarItem>
          <NavbarItem>
            <Button color="primary" variant="flat" size="lg" onPress={() => {redirect("/singup")}}>
              Sing Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      } 
    </div>
  );
}