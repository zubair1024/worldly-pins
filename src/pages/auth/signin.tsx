import useSubmit from '@/hooks/useSubmit';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as z from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const Schema = z.object({
  email: z.string(),
  password: z.string(),
});

const SignInScreen = () => {
  const router = useRouter();
  const { loading, response, handleSignInSubmit } = useSubmit();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values, formikHelpers) => {
      console.log(values);
      await handleSignInSubmit(values.email, values.password);
      formikHelpers.resetForm();
    },
    validationSchema: toFormikValidationSchema(Schema),
  });

  useEffect(() => {
    if (response?.status === 200) {
      router.push('/dashboard');
    }
  }, [response, router]);
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit(e);
        }}
      >
        <input
          type="text"
          placeholder="email"
          {...formik.getFieldProps('email')}
        />
        <input
          type="password"
          placeholder="Password"
          {...formik.getFieldProps('password')}
        />
        <input type="submit" value="login" />
      </form>
    </div>
  );
};

export default SignInScreen;
