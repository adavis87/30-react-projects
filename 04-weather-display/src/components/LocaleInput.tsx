import React from "react";

function LocaleInput({ handleInputChange }) {
    return (
        <div className="form">
            <label htmlFor="location">location</label>
            <input
                type="text"
                onChange={handleInputChange}
                placeholder="los angeles"
                name="location"
                id="location"
            />
            <div className="form-actions">
                <button>submit</button>
            </div>
        </div>
    );
}

export default LocaleInput;
