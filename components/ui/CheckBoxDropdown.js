import React, { useState, useEffect } from 'react';
import { Dropdown, Form } from 'react-bootstrap';

const CheckBoxDropdown = ({ name, options, label, onChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState([]);

    const handleToggle = () => setIsDropdownOpen(!isDropdownOpen);

    const handleCheckboxChange = (option) => {
        setSelectedValues((prev) =>
            prev.includes(option)
                ? prev.filter((val) => val !== option)
                : [...prev, option]
        );
    };

    const handleSelectAll = () => {
        if (selectedValues.length === options.length) {
            setSelectedValues([]);
        } else {
            setSelectedValues(options);
        }
    };

    useEffect(() => {
        onChange(name, selectedValues);
      }, [selectedValues]);

    return (
        <div className="d-flex flex-column gap-2">
            <p className="metro__dropdown-label mb-1">{label}</p>
            <Dropdown
                className="metro__dropdown"
                show={isDropdownOpen}
                onToggle={handleToggle}
            >
                <Dropdown.Toggle
                    variant="light"
                    className="btn dropdown-toggle d-flex gap-2 justify-content-between align-items-center"
                    id="metro-dropdown"
                >
                    <div className="d-flex align-items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                            <path d="M5.45999 0V1.68H3.35999V2.52H5.45999V5.04H3.35999V5.88H5.45999V8.4H3.35999V9.24H5.45999V11.76H3.35999V12.6H5.45999V15.12H3.35999V15.96H5.45999V18.48H3.35999V19.32H5.45999V21H6.29999V0H5.45999ZM14.28 0V1.68H6.71999V2.52H14.28V5.04H6.71999V5.88H14.28V8.4H6.71999V9.24H14.28V11.76H6.71999V12.6H14.28V15.12H6.71999V15.96H14.28V18.48H6.71999V19.32H14.28V21H15.12V0H14.28ZM15.54 1.68V2.52H17.64V1.68H15.54ZM15.54 5.04V5.88H17.64V5.04H15.54ZM15.54 8.4V9.24H17.64V8.4H15.54ZM15.54 11.76V12.6H17.64V11.76H15.54ZM15.54 15.12V15.96H17.64V15.12H15.54ZM15.54 18.48V19.32H17.64V18.48H15.54Z" fill="#2A54A7" />
                        </svg>
                        <p className="p-0 mb-md-0 mb-0">
                            {selectedValues.length === 0 ? 'All' : selectedValues.join(', ')}
                        </p>
                    </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="metro__dropdown-menu px-3" style={{ minWidth: 250, maxHeight: '300px', overflowY: 'auto' }}>
                    <Form.Check
                        type="checkbox"
                        label="All"
                        checked={selectedValues.length === options?.length}
                        onChange={handleSelectAll}
                        className="mb-2"
                    />
                    {options?.map((option, index) => (
                        <Form.Check
                            key={index}
                            id={`${name}-option-${index}`} // Unique ID for each input
                            type="checkbox"
                            label={option}
                            checked={selectedValues.includes(option)}
                            onChange={() => handleCheckboxChange(option)}
                            className="mb-1"
                        />
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default CheckBoxDropdown;
