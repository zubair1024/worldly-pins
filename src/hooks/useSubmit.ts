import axios from 'axios';
import { signIn, SignInResponse } from 'next-auth/react';
import { useState } from 'react';

const useSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<SignInResponse | undefined>(
    undefined,
  );

  const handleSignInSubmit = async (email: string, password: string) => {
    setLoading(true);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setResponse(res);
    setLoading(false);
  };

  const handleSignUpSubmit = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    setLoading(true);
    const res1 = await axios.post('/api/user', {
      email,
      password,
      firstName,
      lastName,
    });
    setLoading(false);
    if (res1.data?.success === true) {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      setResponse(res);
    }
  };

  return {
    loading,
    response,
    handleSignInSubmit,
    handleSignUpSubmit,
  };
};

export default useSubmit;
