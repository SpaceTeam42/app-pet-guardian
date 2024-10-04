export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      homeDrawer: undefined;
      homeTabs: undefined;
      homeScreen: undefined;

      detailPetScreen: { petId: string };
      adoptMeScannerScreen: { petId: string; oldTutorId: string };
      finishAdoptMeScreen: { petId: string; oldTutorId: string };

      signInScreen: { petId: string } | undefined;
      signUpScreen: undefined;

      // PROFILE
      profileScreen: undefined;
      editProfileScreen: undefined;
      editPasswordScreen: undefined;
      removeAccountScreen: undefined;

      detailLookingForPetScreen: { petId: string };

      // NEWS
      detailNewsScreen: { newsId: string };
    }
  }
}
