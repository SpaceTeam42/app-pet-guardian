import AsyncStorage from '@react-native-async-storage/async-storage';

import { ITutor } from 'src/dtos/tutor-dto';

import { TUTOR_STORAGE } from './storage-config';

export async function tutorAdd(tutor: ITutor): Promise<void> {
  await AsyncStorage.setItem(TUTOR_STORAGE, JSON.stringify(tutor));
}

export async function tutorGet(): Promise<ITutor> {
  const storage = await AsyncStorage.getItem(TUTOR_STORAGE);

  const tutor: ITutor = storage ? JSON.parse(storage) : {};

  return tutor;
}

export async function tutorRemove(): Promise<void> {
  await AsyncStorage.removeItem(TUTOR_STORAGE);
}
