import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { UserDetails } from "@/models/auth";
import { useAuth } from '@/context/AuthContext';
import { login } from "@/services/api";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { isValidEmail, isValidPassword } from "@/utils/validations";
import ButtonLoading from "@/components/ui/loading-button";

const Login = () => {
  const router = useRouter()
  const { setUserLoggedIn } = useAuth();
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState(true);
  const [formValidator, setFormValidator] = useState({
    email: true,
    password: true,
  });
  const [userDetails, setUserDetails] = useState<UserDetails>({
    email: "",
    password: "",
  });
  const { email, password } = userDetails;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [event.target.name]: event.target.value });
  };
  const onSubmit = async (): Promise<void> => {
    try {
      setButtonLoading(true)
      const response = await login(userDetails);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("userId", response.data.id)
        setUserLoggedIn(true)
        setButtonLoading(false)
        router.push('/')
      }
    } catch (error: any) {
      setButtonLoading(error.response.data.error)
      toast({
        variant: "destructive",
        title: error.response.data.error ?? "Something went wrong",
      });
    }
  };
  const handleBlur = () => {
    const isEmailValid = isValidEmail(email);
    const isPasswordValid = isValidPassword(password);
    setFormValidator({
      email: isEmailValid,
      password: isPasswordValid,
    });
  };
  useEffect(() => {
    const disableSubmitButton = (): boolean => {
      return (
        !formValidator.email ||
        !formValidator.password ||
        password.trim() === "" ||
        email.trim() === ""
      );
    };
    const isSubmitButtonDisabled = disableSubmitButton();
    setDisableButton(isSubmitButtonDisabled);
  }, [formValidator, email, password]);
  return (
    <div className="wi-full flex items-center justify-center h-screen">
      <Card className="w-30">
        <CardHeader>
          <CardTitle className="text-4xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label className="text-lg" htmlFor="email">
                Email
              </Label>
              <Input
                onChange={(event) => handleChange(event)}
                name="email"
                value={email}
                onBlur={() => handleBlur()}
                id="email"
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label className="text-lg" htmlFor="password">
                Password
              </Label>
              <Input
                onChange={(event) => handleChange(event)}
                name="password"
                value={password}
                onBlur={() => handleBlur()}
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <div className="cursor-pointer flex w-full justify-end ">
            <Link href={"/auth/register"}>Click here to register</Link>
          </div>
        </CardContent>
        <CardFooter className="w-full">
          {!buttonLoading ?
            <Button disabled={disableButton}
              onClick={() => onSubmit()} className="w-full">
              Login
            </Button> :
            <ButtonLoading />
          }
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
