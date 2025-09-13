'use client';
import { FormProvider, useForm } from 'react-hook-form';

import Input from '@/components/input';
import { Button } from '@/components/button';
import Modal from '@/components/modal';
import checkMark from '@/public/assets/check.png';

const CreateSuperAdminProfile = () => {
  const methods = useForm();

  return (
    <div>
      <div className="bg-background py-6 md:py-10 md:px-8 px-3 rounded-[20px] w-full max-w-[676px] mx-auto mt-10">
        <div>
          <div className="flex flex-col gap-10">
            <div className="">
              <h1 className="font-semibold text-xl mb-2 md:text-3xl">
                Super Admin Profile
              </h1>
              <p className="text-gray-400">Enter details to finish</p>
            </div>

            <FormProvider {...methods}>
              <form className="flex flex-col gap-5">
                <Input
                  name="church-owner"
                  label="Church owner full name"
                  placeholder="Enter name"
                />
                <Input
                  name="church-owner-email"
                  label="Owner’s email address"
                  placeholder="admin@church.com"
                />
                <Input
                  name="church-owner-phone"
                  label="Owner’s phone number"
                  placeholder="08039690000"
                />

                <Modal
                  trigger={
                    <Button
                      variant="default"
                      className="place-self-end capitalize mt-10 py-[13.5px] px-10"
                      //   onClick={() => setCloseModal(false)}
                    >
                      Create church
                    </Button>
                  }
                  title="Invites Sent"
                  description="They should get their onboarding details in their mail now"
                  imageURL={checkMark}
                  imageClassName="w-20 h-[85px]"
                  maxWidthClassName="max-w-[442px]"
                  onClose={() => console.log('closed')}
                >
                  {(close) => (
                    <Button
                      onClick={close}
                      variant="default"
                      className="py-[13.5px] px-[47px] mt-10 mx-auto"
                    >
                      Okay
                    </Button>
                  )}
                </Modal>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSuperAdminProfile;
