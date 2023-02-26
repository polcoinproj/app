import AsyncStorage from "@react-native-async-storage/async-storage";
import { AtomEffect, DefaultValue } from "recoil";

export function persistAtom<T>(key: string): AtomEffect<T> {
    return ({setSelf, onSet}) => {
      setSelf(AsyncStorage.getItem(key).then(savedValue =>
        savedValue != null
          ? JSON.parse(savedValue)
          : new DefaultValue() 
      ));
  
      onSet((newValue, _, isReset) => {
        isReset
          ? AsyncStorage.removeItem(key)
          : AsyncStorage.setItem(key, JSON.stringify(newValue));
      });
    };
  }