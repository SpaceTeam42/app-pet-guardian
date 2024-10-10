import AsyncStorage from '@react-native-async-storage/async-storage';

import { IPetDTO } from 'src/dtos/pet-dto';

import { PETS_FAVORITE_STORAGE } from './storage-config';

export async function petFavoriteGetAll(): Promise<IPetDTO[]> {
  try {
    const storage = await AsyncStorage.getItem(PETS_FAVORITE_STORAGE);

    const petsFavorite: IPetDTO[] = storage ? JSON.parse(storage) : [];

    return petsFavorite;
  } catch (error) {
    throw error;
  }
}

export async function petFavoriteAdd(pet: IPetDTO): Promise<void> {
  try {
    const response = await petFavoriteGetAll();
    const storagePetsFavorites = response || [];

    const storage = JSON.stringify([...storagePetsFavorites, pet]);

    await AsyncStorage.setItem(PETS_FAVORITE_STORAGE, storage);
  } catch (error) {
    throw error;
  }
}

export async function petFavoriteRemove(petId: string) {
  try {
    const storage = await petFavoriteGetAll();

    const filtered = storage.filter((petFavorite) => petFavorite.id !== petId);
    const petsFavorite = JSON.stringify(filtered);

    await AsyncStorage.setItem(PETS_FAVORITE_STORAGE, petsFavorite);
  } catch (error) {
    throw error;
  }
}
