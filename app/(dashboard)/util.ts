import { RoleEnum, UserProfile } from '@/types/user.type';

export const verifyUserHasOnboarded = (user: UserProfile) => {
  let redirectTo = '';
  let onboardingComplete = false;

  const onboardingUrls = {
    gospoolAdmin: {
      passwordReset: '/onboarding/gospool-admin',
    },
    churchAdmin: {
      passwordReset: '/onboarding/church-admin',
      addChurch: '/create-church-profile',
    },
    branchLeader: {
      passwordReset: '/onboarding/branch-leader',
      addBranch: '/onboarding/church-admin/add-branch',
    },
  };

  const userRole = user.roles[0] as keyof typeof onboardingUrls;
  console.log('User Role:', userRole);

  switch (userRole) {
    case RoleEnum.GOSPOOL_ADMIN: {
      onboardingComplete = true;
      break;
    }

    case RoleEnum.CHURCH_ADMIN: {
      if (!user.church) {
        redirectTo = onboardingUrls.churchAdmin.addChurch;
      }
      onboardingComplete = !!user.church;
      break;
    }

    case RoleEnum.BRANCH_LEADER: {
      redirectTo = onboardingUrls.branchLeader.passwordReset;
      onboardingComplete = true;
      break;
    }

    default:
      break;
  }

  return {
    onboardingComplete,
    onboardingUrl: redirectTo || '',
  };
};
