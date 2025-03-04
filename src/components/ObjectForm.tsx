import * as React from 'react';
import Select, { MultiValue } from "react-select";
import { ObjectContext } from '../context/ObjectsContext';
import { ObjectContextType, ManagedObject } from '../types/Object';

/**
 * Sanitizes input to prevent potential security risks (e.g SQL injections).
 * It removes special characters like quotes, semicolons, and brackets.
 */
const sanitizeInput = (input: string) => {
    return input.replace(/['";$%#()=<>]/g, "").trim(); 
};

const AddObject: React.FC = () => {
    const { saveObject, managedObjects } = React.useContext(ObjectContext) as ObjectContextType;
    const [formData, setFormData] = React.useState<Partial<ManagedObject>>({
        name: "",
        description: "",
        type: ""
    });    
    const [selectedRelatedObjects, setSelectedRelatedObjects] = React.useState<number[]>([]);
    /**
     * Handles input changes, sanitizing the value before updating state.
     */
    const handleForm = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const sanitizedValue = sanitizeInput(e.currentTarget.value);
        setFormData({
            ...formData,
            [e.currentTarget.id]: sanitizedValue,
        });
    };

    /**
     * Updates the selected related objects based on user selection.
     */
    const handleSelect = (selectedOptions: MultiValue<{ value: number; label: string }>) => {
        setSelectedRelatedObjects(selectedOptions.map(option => option.value));
    };

    /**
     * Handles form submission, ensuring inputs are valid and preventing duplicates.
     */
    const handleSaveObject = (e: React.FormEvent) => {
        const { name, description, type } = formData;

        if (!name || !description || !type) return;

        if (managedObjects.some(obj => obj.name.toLowerCase() === name.toLowerCase())) {
            alert("Error: An object with this name already exists.");
            return;
        }

        saveObject({
            id: Math.random(),
            name,
            description,
            type,
            relatedObjectIds: selectedRelatedObjects,
        });
        setFormData({ name: "", description: "", type: "" });
        setSelectedRelatedObjects([]);
    };

    return (
        <div className="container mt-5">
            <div className="card p-3">
                <h5 className="text-center">Add New Object</h5>
                <form onSubmit={handleSaveObject} className="d-flex gap-2">
                    <input onChange={handleForm} type="text" id="name" className="form-control" placeholder="Name" />
                    <input onChange={handleForm} type="text" id="description" className="form-control" placeholder="Description" />
                    <input onChange={handleForm} type="text" id="type" className="form-control" placeholder="Type" />
                    <div className="w-100">
                        <Select
                            isMulti
                            options={managedObjects
                                .filter(obj => obj.name !== formData.name)
                                .map(obj => ({ value: obj.id, label: obj.name }))}
                            onChange={handleSelect}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </div>
                    <button className="btn btn-primary" disabled={!formData.name || !formData.description || !formData.type}>
                        +
                    </button>
                </form>
            </div>
        </div>
  );
};
export default AddObject;