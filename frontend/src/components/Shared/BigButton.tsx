import React from 'react'; 

export interface BigButtonProps {
    disabled: boolean;
    disabledText: string;
    enabledText: string;
}

const BigButton: React.FC<BigButtonProps> = ({ disabled, disabledText, enabledText }) => {
    return (
        <button
            type="submit"
            data-testid="big-button_button"
            disabled={disabled}
            className={`px-6 py-3 transition-colors duration-300 ${
            disabled
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-primary-medium hover:bg-primary-dark"
            } text-white font-semibold rounded-lg shadow-md w-full`}
          >
            {disabled ? disabledText : enabledText}
          </button>
    );
};

export default BigButton;