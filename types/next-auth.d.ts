import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's role. */
            role: string
            sessionVersion: number
        } & DefaultSession["user"]
    }

    interface User {
        role: string
        sessionVersion: number
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        /** The user's role. */
        role: string
        sessionVersion: number
    }
}
