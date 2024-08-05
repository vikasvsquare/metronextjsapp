// middleware.js
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = { matcher: ['/', '/crime/bus', '/crime/busystem-wides'] };
