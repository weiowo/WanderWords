import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex justify-center align-center">
      <SignIn />
    </div>
  );
}
