import useSubmit from '@/hooks/useSubmit';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import z from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const Schema = z.object({
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

const SignUpScreen = () => {
  const router = useRouter();
  const { loading, response, handleSignUpSubmit } = useSubmit();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        await handleSignUpSubmit(
          values.email,
          values.password,
          values.firstName,
          values.lastName,
        );
        formikHelpers.resetForm();
      } catch (err) {
        if (err instanceof Error) toast.error(err.message);
      }
    },
    validationSchema: toFormikValidationSchema(Schema),
  });

  useEffect(() => {
    if (response?.status === 401) {
      toast.error(`Invalid Credentials`);
    }
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
          <h1 className="text-center">Sign Up</h1>
          <div>
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              className="w-full input input-bordered input-md"
              type="text"
              placeholder="First Name"
              {...formik.getFieldProps('firstName')}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              className="w-full input input-bordered input-md"
              type="text"
              placeholder="Last Name"
              {...formik.getFieldProps('lastName')}
            />
          </div>
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
              value={loading ? 'Loading' : 'Login'}
              disabled={loading}
            />
          </div>
          <div>
            <p>
              Have an account?{' '}
              <Link href={'/auth/signin'} className="underline">
                Sign In
              </Link>{' '}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpScreen;
