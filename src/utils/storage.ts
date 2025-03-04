const STORAGE_KEY = "managedObjects";

/**
 * save objects in localStorage
 */
export const saveToLocalStorage = (objects: unknown) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objects));
};

/**
 * load objects from localStorage
 */
export const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
};
