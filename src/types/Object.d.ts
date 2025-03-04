/**
 * Defines the structure of an object.
 */
export interface ManagedObject {
    id: number;
    name: string;
    description: string;
    type: string;
    relatedObjectIds: number[];
}

/**
 * Defines the shape of the context used to manage objects.
 */
export type ObjectContextType = {
    managedObjects: ManagedObject[];
    filteredObjects: ManagedObject[];
    saveObject: (managedObject: ManagedObject) => void;
    updateObject: (id: number, updatedData: Partial<ManagedObject>) => void;
    deleteObject: (id: number) => void;
    filterObjects: (query: string) => void;
};

/**
 * Props for the EditableObject component, picking only necessary functions from ObjectContextType.
 */
export type EditableObjectProps = Pick<ObjectContextType, "updateObject" | "deleteObject"> & {
    object: ManagedObject;
};
  