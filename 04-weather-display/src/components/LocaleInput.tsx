import type { ChangeEvent } from "react";

type Props = {
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function LocaleInput({ handleInputChange }: Props) {
    return (
        <div className="form">
            <label htmlFor="location">location</label>
            <input
                type="text"
                onChange={(e) => handleInputChange(e)}
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
