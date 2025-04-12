"use client";

import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";

type LoginProps = {
  children: React.ReactNode;
};

export function Login({ children }: LoginProps) {
  return (
    <Button size="sm" variant="outline" onClick={() => signIn()}>
      {children}
    </Button>
  );
}
