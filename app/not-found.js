import LandingNav from '@/components/LandingNav';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <LandingNav/>
      <main className="min-h-screen relative z-10 overflow-hidden flex justify-center items-center font-bold text-3xl flex-col">
        <h1>Not found – 404!</h1> 
        <div>
          <Link href="/">Go back to <span className='text-blue-500'>Home</span></Link>
        </div>
      </main>
    </>
  );
}
