import AsyncStorage from '@react-native-async-storage/async-storage';

import { ITutorDTO } from 'src/dtos/tutor-dto';

import { TUTOR_STORAGE } from './storage-config';

export async function tutorAdd(tutor: ITutorDTO): Promise<void> {
  await AsyncStorage.setItem(TUTOR_STORAGE, JSON.stringify(tutor));
}

export async function tutorGet(): Promise<ITutorDTO> {
  const storage = await AsyncStorage.getItem(TUTOR_STORAGE);

  const tutor: ITutorDTO = storage ? JSON.parse(storage) : {};

  return tutor;
}

export async function tutorRemove(): Promise<void> {
  await AsyncStorage.removeItem(TUTOR_STORAGE);
}
