import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  ReactNode,
} from 'react';

import {
  petFavoriteGetAll,
  petFavoriteRemove,
} from '@storage/storage-pet-favorite';

interface IPet {
  id: string;
  name: string;
  gender: string;
  gender_formatted: string;
  city: string;
  state: string;
  avatar_url: string;
}

interface IPetFavoriteContextData {
  loading: boolean;
  petsFavorite: IPet[];
  verifyIsPetFavorite(petId: string): Promise<boolean>;
  getPetsFavorite(): Promise<IPet[]>;
  addPetFavorite(pet: IPet): Promise<void>;
  removePetFavorite(petId: string): Promise<void>;
}

interface IPetProviderProps {
  children: ReactNode;
}

// const PETS_FAVORITE_KEY_LOCALSTORAGE = '@GenerationPet:pets_favorites';

const PetsFavoriteContext = createContext<IPetFavoriteContextData>(
  {} as IPetFavoriteContextData,
);

const PetsFavoriteProvider = ({ children }: IPetProviderProps) => {
  const [data, setData] = useState<IPet[]>([]);
  const [loading, setLoading] = useState(false);

  // FUNCTIONS
  const verifyIsPetFavorite = useCallback(async (petId: string) => {
    const petsFavorite = await petFavoriteGetAll();

    const petFound = petsFavorite.some((pet) => pet.id === petId);

    return petFound;

    // const response = await AsyncStorage.getItem(PETS_FAVORITE_KEY_LOCALSTORAGE);

    // if (response) {
    //   const petsFavorite = JSON.parse(response) as IPet[];

    //   const petFound = petsFavorite.some((pet) => pet.id === petId);

    //   return petFound;
    // }

    // return false;
  }, []);

  const getPetsFavorite = useCallback(async () => {
    const response = petFavoriteGetAll();

    return response;
  }, []);

  const addPetFavorite = useCallback(async (petFavorite: IPet) => {
    setLoading(true);

    await addPetFavorite(petFavorite);

    const petsFavorite = await petFavoriteGetAll();

    setData(petsFavorite);

    setLoading(false);
  }, []);

  const removePetFavorite = useCallback(async (petId: string) => {
    setLoading(true);

    await petFavoriteRemove(petId);

    const petsFavorite = await petFavoriteGetAll();

    setData(petsFavorite);

    setLoading(false);
  }, []);
  // END FUNCTIONS

  useEffect(() => {
    async function loadData() {
      const petsFavorite = await petFavoriteGetAll();

      setData(petsFavorite);
    }

    loadData();
  }, []);

  return (
    <PetsFavoriteContext.Provider
      value={{
        loading,
        petsFavorite: data,
        verifyIsPetFavorite,
        getPetsFavorite,
        addPetFavorite,
        removePetFavorite,
      }}
    >
      {children}
    </PetsFavoriteContext.Provider>
  );
};

function usePetsFavorite() {
  const context = useContext(PetsFavoriteContext);

  if (!context) {
    throw new Error(
      'usePetsFavorite must be use whiting as PetsFavoriteProvider',
    );
  }

  return context;
}

export { PetsFavoriteProvider, usePetsFavorite };
