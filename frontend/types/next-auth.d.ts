import "next-auth";

declare module "next-auth" {
  interface Session {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }
  interface User {
    id: string;
    role: string;
    token: string;
  }
}
