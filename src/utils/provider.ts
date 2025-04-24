"use client"

import React from "react";

import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    return React.createElement(SessionProvider, null, children);
};

