import localStorageService from '../../services/localStorageService';

export const readStorage = (key, fallback) => localStorageService.getData(key, fallback);

export const writeStorage = (key, value) => {
  localStorageService.setData(key, value);
  return value;
};

