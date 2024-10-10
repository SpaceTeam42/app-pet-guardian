type ILookingForPetImages = {
  id: string;
  image_url: string;
};

export type ILookingForPetDTO = {
  id: string;
  name_pet: string;
  gender: string;
  gender_formatted: string;
  name_tutor: string;
  phone_tutor: string;
  phone_tutor_is_whatsapp: boolean;
  last_seen: string;
  description: string;
  city: string;
  state: string;
  avatar_url: string;
  looking_for_pet_images: Array<ILookingForPetImages>;
};
