import * as React from "react";
import { ObjectContext } from "../context/ObjectsContext";
import { ManagedObject } from "../types/Object";
import EditableObject from "./EditableObject";

const ObjectList = () => {
    const context = React.useContext(ObjectContext);
    if (!context) return <p>Loading...</p>;
    const { filteredObjects, updateObject, deleteObject } = context;

    return (
        <div className="container mt-5">
            <ul className="list-group">
                {filteredObjects.length > 0 ? (
                    filteredObjects.map((object: ManagedObject) => (
                        <EditableObject key={object.id} object={object} updateObject={updateObject} deleteObject={deleteObject} />
                    ))
                ) : (
                    <li className="list-group-item text-center">No objects found</li>
                )}
            </ul>
        </div>
    );
};

export default ObjectList;
