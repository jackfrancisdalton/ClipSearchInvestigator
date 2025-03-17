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
            disabled={disabled}
            className={`px-6 py-3 ${
                disabled ? "bg-gray-500 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-300"
            } text-white font-semibold rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-primary-500`}
          >
            {disabled ? disabledText : enabledText}
          </button>
    );
};

export default BigButton;