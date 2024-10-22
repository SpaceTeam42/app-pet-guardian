import { ITutorDTO } from './tutor-dto';

type IPetImages = {
  id: string;
  image_url: string;
};

export type IPetDTO = {
  id: string;
  name: string;
  birthday: Date;
  age_formatted: string;
  gender: string;
  gender_formatted: string;
  size: string;
  weight: string;
  description: string;
  city: string;
  state: string;
  tutor: ITutorDTO;
  avatar_url: string;
  pet_images: Array<IPetImages>;
};
