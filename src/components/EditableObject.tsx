import * as React from 'react';
import Select, { MultiValue } from "react-select";
import { ManagedObject, EditableObjectProps } from '../types/Object';
import { ObjectContext } from '../context/ObjectsContext';

const EditableObject: React.FC<EditableObjectProps> = ({ object, updateObject, deleteObject }) => {
    const context = React.useContext(ObjectContext);
    const { managedObjects } = context!;

    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState<Partial<ManagedObject>>({ ...object });
    const [selectedRelatedObjects, setSelectedRelatedObjects] = React.useState<number[]>(object.relatedObjectIds || []);

    /**
     * Synchronizes the selected related objects when managedObjects change.
     */
    React.useEffect(() => {
        setSelectedRelatedObjects(object.relatedObjectIds || []);
    }, [object.relatedObjectIds, managedObjects]);
    /**
     * Handles input changes for the object properties.
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * Updates the selected related objects.
     */
    const handleSelectChange = (selectedOptions: MultiValue<{ value: number; label: string }>) => {
        setSelectedRelatedObjects(selectedOptions.map(option => option.value));
    };

    /**
     * Saves the updated object details and exits edit mode.
     */
    const handleSave = () => {
        // Retrieve the original and updated related object sets
        const previousRelatedObjects = new Set(object.relatedObjectIds);
        const newRelatedObjects = new Set(selectedRelatedObjects);
    
        // Identify removed relationships (previously related but now removed)
        const removedRelations = Array.from(previousRelatedObjects).filter(
            (id) => !newRelatedObjects.has(id)
        );
    
        // Identify newly added relationships (new selections that were not previously related)
        const addedRelations = Array.from(newRelatedObjects).filter(
            (id) => !previousRelatedObjects.has(id)
        );
    
        // Update the edited object with the new relationships
        updateObject(object.id, { ...formData, relatedObjectIds: selectedRelatedObjects });
    
        // Ensure bidirectional relationships: update related objects to include this object
        addedRelations.forEach((relatedId) => {
            const relatedObj = managedObjects.find((obj) => obj.id === relatedId);
            if (relatedObj && !relatedObj.relatedObjectIds.includes(object.id)) {
                updateObject(relatedId, {
                    relatedObjectIds: [...relatedObj.relatedObjectIds, object.id],
                });
            }
        });
    
        // Remove this object from relationships that were removed
        removedRelations.forEach((removedId) => {
            const relatedObj = managedObjects.find((obj) => obj.id === removedId);
            if (relatedObj) {
                updateObject(removedId, {
                    relatedObjectIds: relatedObj.relatedObjectIds.filter((id) => id !== object.id),
                });
            }
        });
    
        setIsEditing(false);
    };    
    

    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            {isEditing ? (
                <div className="d-flex flex-column w-100">
                    <input name="name" value={formData.name || ""} onChange={handleInputChange} className="form-control mb-1" placeholder="Name" />
                    <input name="description" value={formData.description || ""} onChange={handleInputChange} className="form-control mb-1" placeholder="Description" />
                    <input name="type" value={formData.type || ""} onChange={handleInputChange} className="form-control mb-1" placeholder="Type" />
                    <label className="mt-2">Related Objects</label>
                    <Select
                        isMulti
                        options={managedObjects
                            .filter(obj => obj.name !== formData.name)
                            .map(obj => ({ value: obj.id, label: obj.name }))
                        }
                        onChange={handleSelectChange}
                        value={managedObjects
                            .filter(obj => selectedRelatedObjects.includes(obj.id))
                            .map(obj => ({ value: obj.id, label: obj.name }))
                        }
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                    <div className="d-flex gap-2 mt-2">
                        <button className="btn btn-success btn-sm" onClick={handleSave}>
                            Save
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <span>{object.name}</span>
                    <div className="d-flex gap-2">
                        <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
                            &#9998;
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteObject(object.id)}>
                            x
                        </button>
                    </div>
                </>
            )}
        </li>
    );
};

export default EditableObject;