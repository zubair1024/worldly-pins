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

  return {
    loading,
    response,
    handleSignInSubmit,
  };
};

export default useSubmit;
