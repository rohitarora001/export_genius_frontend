import { NextShield } from "next-shield";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { authRoutes } from "@/utils/constants";
import { SocketProvider } from "@/context/SocketContext";
import "../styles/globals.css";
import Loader from "@/components/Loader/";
import { Toaster } from "@/components/ui/toaster";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AuthProvider>
      <SocketProvider>
        <AppContent Component={Component} pageProps={pageProps} router={router} />
      </SocketProvider>
    </AuthProvider>
  );
}

// Add router prop to the type definition of AppContent
interface AppContentProps extends AppProps {
  router: any; // Adjust the type if necessary
}

function AppContent({ Component, pageProps, router }: AppContentProps) {
  const { userLoggedIn } = useAuth();

  return (
    <NextShield
      isAuth={userLoggedIn}
      isLoading={false}
      router={router}
      privateRoutes={["/"]}
      publicRoutes={[authRoutes.login, authRoutes.signup]}
      accessRoute="/"
      loginRoute={authRoutes.login}
      LoadingComponent={<div className="w-full h-screen flex justify-center align-center"><Loader loading={true} variant="scaleloader" /></div>}
    >
      <Component {...pageProps} />
      <Toaster />
    </NextShield>
  );
}
