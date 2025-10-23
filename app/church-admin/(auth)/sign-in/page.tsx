// 'use client';

// import GetStarted from '@/components/getStarted';
// import SignIn from '@/components/sign-in';
// import { useState } from 'react';
// import UpdatePassword from '@/components/updatePassword';
// import ShowView from '@/components/show-view';

// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Sign in',
// };

const SignInPage = () => {
  // const [updatePassword, setUpdatePassword] = useState(false);
  // const [login, setLogin] = useState(false);

  // console.log(updatePassword, login);
  return (
    <div>
      {/* <ShowView when={!updatePassword && !login}>
        <GetStarted setUpdatePassword={setUpdatePassword} />
      </ShowView>
      <ShowView when={login}>
        <SignIn />
      </ShowView>
      <ShowView when={updatePassword}>
        <UpdatePassword setLogin={setLogin} />
      </ShowView> */}
    </div>
  );
};

export default SignInPage;
