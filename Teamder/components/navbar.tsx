// src/components/TeamderNavbar.tsx
"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link // Import Link for potential future use
} from "@heroui/react";

interface TeamderNavbarProps {
  onLoginOpen: () => void;
  onSignupOpen: () => void;
}

export const TeamderNavbar: React.FC<TeamderNavbarProps> = ({ onLoginOpen, onSignupOpen }) => {
  return (
    <Navbar isBordered maxWidth="xl">
      <NavbarBrand>
        {/* <AcmeLogo /> You could place a logo component here */}
        <p className="font-bold text-inherit text-lg">Teamder</p>
      </NavbarBrand>

      {/* Optional: Add center content later if needed */}
      {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">Features</Link>
        </NavbarItem>
      </NavbarContent> */}

      <NavbarContent justify="end">
        <NavbarItem>
          <Button onPress={onLoginOpen} color="default" variant="light" size="md">
            Log In
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button onPress={onSignupOpen} color="primary" variant="flat" size="md">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export { Navbar };