import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#3b82f6",
            colorBackground: "#1f2937",
            colorText: "#f9fafb",
            colorInputBackground: "#374151",
          },
        }}
      />
    </div>
  );
}
