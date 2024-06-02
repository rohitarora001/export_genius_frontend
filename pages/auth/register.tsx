import React, { useState, useEffect } from "react";
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
import { register } from "@/services/api";
import { isValidEmail, isValidPassword } from "@/utils/validations";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/router";
import { UserDetails } from "@/models/auth";
import ButtonLoading from "@/components/ui/loading-button";
import { authRoutes } from "@/utils/constants";
const Register = () => {
  const router = useRouter();
  const [formValidator, setFormValidator] = useState({
    email: true,
    password: true,
  });
  const [disableButton, setDisableButton] = useState(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    email: "",
    password: "",
  });
  const { email, password } = userDetails;
  const resetState = () => {
    setUserDetails({
      email: "",
      password: "",
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      setButtonLoading(true)
      const response = await register(userDetails);
      if (response.status === 201) {
        toast({
          variant: "success",
          title: response.data.message,
        });
        setButtonLoading(false)
        resetState();
        router.push(authRoutes.login);
      }
    } catch (error: any) {
      setButtonLoading(false)
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

  return (
    <div>
      <div className="wi-full flex items-center justify-center h-screen">
        <Card className="w-30">
          <CardHeader>
            <CardTitle className="text-4xl">Create Account</CardTitle>
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
                  id="email"
                  onBlur={() => handleBlur()}
                  type="email"
                  placeholder="Enter your email"
                />
                {!formValidator.email && (
                  <p className=" text-red-500">Please enter a valid email</p>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label className="text-lg" htmlFor="password">
                  Password
                </Label>
                <Input
                  onChange={(event) => handleChange(event)}
                  name="password"
                  value={password}
                  id="password"
                  type="password"
                  onBlur={() => handleBlur()}
                  placeholder="Enter your password"
                />
                {!formValidator.password && (
                  <p className=" text-red-500">
                    Password should be at least 8 characters long{" "}
                  </p>
                )}
              </div>
            </div>
            <div className="cursor-pointer flex w-full justify-end ">
              <Link href={"/auth/login"}>Already have an account?</Link>
            </div>
          </CardContent>
          <CardFooter className="w-full">
            {!buttonLoading ?
              <Button
                disabled={disableButton}
                className="w-full"
                onClick={() => handleSubmit()}
              >
                Create account
              </Button>
              :
              <ButtonLoading />
            }
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
