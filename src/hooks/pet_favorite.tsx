import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

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
  petsFavorite: Array<IPet>;
  verifyIsPetFavorite(petId: string): Promise<boolean>;
  getPetsFavorite(): Promise<IPet[]>;
  addPetFavorite(pet: IPet): Promise<void>;
  removePetFavorite(petId: string): Promise<void>;
}

interface IPetProviderProps {
  children: React.ReactNode;
}

const PETS_FAVORITE_KEY_LOCALSTORAGE = '@GenerationPet:pets_favorites';

const PetsFavoriteContext = createContext<IPetFavoriteContextData>(
  {} as IPetFavoriteContextData,
);

const PetsFavoriteProvider = ({ children }: IPetProviderProps) => {
  const [data, setData] = useState<IPet[]>([]);
  const [loading, setLoading] = useState(false);

  // FUNCTIONS
  const verifyIsPetFavorite = useCallback(async (petId: string) => {
    const response = await AsyncStorage.getItem(PETS_FAVORITE_KEY_LOCALSTORAGE);

    if (response) {
      const petsFavorite = JSON.parse(response) as IPet[];

      const petFound = petsFavorite.some(pet => pet.id === petId);

      return petFound;
    }

    return false;
  }, []);

  const getPetsFavorite = useCallback(async () => {
    const response = await AsyncStorage.getItem(PETS_FAVORITE_KEY_LOCALSTORAGE);

    if (response) {
      const petsFavorite = JSON.parse(response) as IPet[];

      return petsFavorite;
    }

    return [];
  }, []);

  const addPetFavorite = useCallback(async (petFavorite: IPet) => {
    setLoading(true);

    const response = await AsyncStorage.getItem(PETS_FAVORITE_KEY_LOCALSTORAGE);

    if (response) {
      const petsFavorite = JSON.parse(response) as IPet[];

      const newPetFavorite = [...petsFavorite, petFavorite];

      await AsyncStorage.setItem(
        PETS_FAVORITE_KEY_LOCALSTORAGE,
        JSON.stringify(newPetFavorite),
      );

      setData(newPetFavorite);
    } else {
      const newPetFavorite = [petFavorite];

      await AsyncStorage.setItem(
        PETS_FAVORITE_KEY_LOCALSTORAGE,
        JSON.stringify(newPetFavorite),
      );

      setData(newPetFavorite);
    }

    setLoading(false);
  }, []);

  const removePetFavorite = useCallback(async (petId: string) => {
    setLoading(true);

    const responsePets = await AsyncStorage.getItem(
      PETS_FAVORITE_KEY_LOCALSTORAGE,
    );

    if (responsePets) {
      const petsFavorite = JSON.parse(responsePets) as IPet[];

      const petsFavoriteFiltered = petsFavorite.filter(
        petFavorite => petFavorite.id !== petId,
      );

      await AsyncStorage.setItem(
        PETS_FAVORITE_KEY_LOCALSTORAGE,
        JSON.stringify(petsFavoriteFiltered),
      );

      setData(petsFavoriteFiltered);
    }

    setLoading(false);
  }, []);
  // END FUNCTIONS

  useEffect(() => {
    async function loadData() {
      const response = await AsyncStorage.getItem(
        PETS_FAVORITE_KEY_LOCALSTORAGE,
      );

      if (response) {
        const petsFavorite = JSON.parse(response) as IPet[];

        setData(petsFavorite);
      } else {
        setData([]);
      }
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
