import * as React from 'react';
import { ManagedObject, ObjectContextType } from '../types/Object';
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/storage";

/**
 * Creates a React context for managing objects.
 */
export const ObjectContext = React.createContext<ObjectContextType | null>(null);

/**
 * Provider component that handles object state and context.
 */
const ObjectProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Load objects from local storage or initialize an empty array
  const [managedObjects, setManagedObjects] = React.useState<ManagedObject[]>(() => loadFromLocalStorage());
  const [filteredObjects, setFilteredObjects] = React.useState<ManagedObject[]>(managedObjects);

  // Save objects to local storage whenever they change
  React.useEffect(() => {
      saveToLocalStorage(managedObjects);
  }, [managedObjects]);

    /**
     * Adds a new object to the system.
     */
    const saveObject = (managedObject: ManagedObject) => {
      setManagedObjects(prevObjects => {
          const newObject = {
              ...managedObject,
              relatedObjectIds: [...managedObject.relatedObjectIds],
          };
  
          const updatedObjects = prevObjects.map(obj => {
              if (newObject.relatedObjectIds.includes(obj.id)) {
                  return {
                      ...obj,
                      relatedObjectIds: Array.from(new Set([...obj.relatedObjectIds, newObject.id])),
                  };
              }
              return obj;
          });
  
          return [...updatedObjects, newObject];
      });
  
      setFilteredObjects(prevObjects => [...prevObjects, managedObject]);
  };  
  

    /**
     * Updates an existing object by merging new data.
     */
    const updateObject = (id: number, updatedData: Partial<ManagedObject>) => {
      setManagedObjects((prevObjects) => {
          return prevObjects.map((obj) => {
              if (obj.id === id) {
                  return { ...obj, ...updatedData };
              }
  
              // If the updated object has a new relation, update the related object as well
              if (updatedData.relatedObjectIds?.includes(obj.id)) {
                  return {
                      ...obj,
                      relatedObjectIds: Array.from(new Set([...obj.relatedObjectIds, id])),
                  };
              }
  
              // If the relation was removed from the updated object, remove it from the related object too
              if (obj.relatedObjectIds.includes(id) && !updatedData.relatedObjectIds?.includes(obj.id)) {
                  return {
                      ...obj,
                      relatedObjectIds: obj.relatedObjectIds.filter((relId) => relId !== id),
                  };
              }
  
              return obj;
          });
      });
  
      setFilteredObjects((prevObjects) =>
          prevObjects.map((obj) => (obj.id === id ? { ...obj, ...updatedData } : obj))
      );
  };  

    /**
     * Deletes an object from the system.
     */
    const deleteObject = (id: number) => {
      setManagedObjects((prevObjects) =>
          prevObjects
              .filter((obj) => obj.id !== id)
              .map((obj) => ({
                  ...obj,
                  relatedObjectIds: obj.relatedObjectIds.filter((relId) => relId !== id),
              }))
      );
  
      setFilteredObjects((prevObjects) =>
          prevObjects
              .filter((obj) => obj.id !== id)
              .map((obj) => ({
                  ...obj,
                  relatedObjectIds: obj.relatedObjectIds.filter((relId) => relId !== id),
              }))
      );
  };  

    /**
     * Filters objects based on a search query (by name or description).
     */
    const filterObjects = (query: string) => {
      if (query.length === 0) {
          setFilteredObjects(managedObjects);
      } else {
          setFilteredObjects(managedObjects.filter(obj =>
              obj.name.toLowerCase().includes(query.toLowerCase()) ||
              obj.description.toLowerCase().includes(query.toLowerCase())
          ));
      }
    };
    return(
      <ObjectContext.Provider value={{ managedObjects, filteredObjects, saveObject, updateObject, deleteObject, filterObjects }}>
        {children}
      </ObjectContext.Provider>
    );
  };
  
export default ObjectProvider;