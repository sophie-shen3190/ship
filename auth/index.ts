import NextAuth from "next-auth";
import { authOptions } from "./config";
import { NextRequest } from "next/server";

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

