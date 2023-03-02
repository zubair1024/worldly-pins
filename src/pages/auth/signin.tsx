import useSubmit from '@/hooks/useSubmit';
import { useFormik } from 'formik';
import Link from 'next/link';
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
    <div style={{ backgroundImage: 'url(/ny-city.jpeg)' }} className="">
      <div className="flex flex-col items-center justify-center h-[100vh]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit(e);
          }}
          style={{ backgroundImage: 'none' }}
          className="p-10 rounded-lg shadow-lg card glass"
        >
          <h1 className="text-center">Login</h1>
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              className="w-full input input-bordered input-md"
              type="text"
              placeholder="email"
              {...formik.getFieldProps('email')}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              className="w-full input input-bordered input-md"
              type="password"
              placeholder="Password"
              {...formik.getFieldProps('password')}
            />
          </div>
          <div className="py-10">
            <input
              className="w-full btn btn-secondary"
              type="submit"
              value="Login"
            />
          </div>
          <div>
            <p>
              Don&apos;t have an account?{' '}
              <Link href={'#'} className="underline">
                Sign Up
              </Link>{' '}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInScreen;
