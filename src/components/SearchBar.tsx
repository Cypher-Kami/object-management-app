import * as React from "react";
import { ObjectContext } from "../context/ObjectsContext";
import { ManagedObject } from "../types/Object";

const SearchBar: React.FC = () => {
    const context = React.useContext(ObjectContext);
    const [query, setQuery] = React.useState("");
    const [filteredObjects, setFilteredObjects] = React.useState<ManagedObject[]>([]);
    const [showDropdown, setShowDropdown] = React.useState(false);

    if (!context) return <p>Loading...</p>;
    const { filterObjects, managedObjects } = context;

    /**
     * Handles user input in the search bar.
     * Filters objects based on name or description and displays dropdown results.
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        filterObjects(value);

        if (value.length > 0) {
            const results = managedObjects.filter((obj) =>
                obj.name.toLowerCase().includes(value.toLowerCase()) ||
                obj.description.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredObjects(results);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    /**
     * Handles selection of an object from the dropdown.
     * Updates the search bar text and filters the object list accordingly.
     */
    const handleSelect = (object: ManagedObject) => {
        setQuery(object.name);
        filterObjects(object.name);
        setShowDropdown(false);
    };

    /**
     * Hides the dropdown when clicking outside the search area.
     */
    const handleBlur = () => {
        setTimeout(() => setShowDropdown(false), 200);
    };

    return (
        <div className="container mt-3 mb-3 position-relative">
            <div className="input-group">
                <span className="input-group-text">
                    &#128269;
                </span>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search objects..."
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={handleBlur}
                />
            </div>

            {showDropdown && filteredObjects.length > 0 && (
                <ul className="list-group position-absolute w-100 shadow mt-1" style={{ zIndex: 1000 }}>
                    {filteredObjects.map((object) => (
                        <li
                            key={object.id}
                            className="list-group-item list-group-item-action"
                            onMouseDown={() => handleSelect(object)}
                        >
                            {object.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
