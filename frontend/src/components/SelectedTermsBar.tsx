import React, { useState } from 'react';

interface SelectedTermsBarProps {
    terms: string[];
    onTermClick: (term: string, isActive: boolean) => void;
}

const SelectedTermsBar: React.FC<SelectedTermsBarProps> = ({ terms, onTermClick }) => {
    const [activeTerms, setActiveTerms] = useState<string[]>([]);

    const handleTermClick = (term: string) => {
        const isActive = activeTerms.includes(term);
        const newActiveTerms = isActive
            ? activeTerms.filter(t => t !== term)
            : [...activeTerms, term];

        setActiveTerms(newActiveTerms);
        onTermClick(term, !isActive);
    };

    return (
        <div className="flex gap-2 mt-0 mb-4 p-4 rounded-lg bg-background-500 items-center">
            <span className="mr-4">Filter by term:</span>
            {terms.map(term => (
            <div
                key={term}
                onClick={() => handleTermClick(term)}
                className={`p-2 rounded-lg ${activeTerms.includes(term) ? 'bg-primary-600' : 'bg-primary-300'}`}
            >
                {term}
            </div>
            ))}
        </div>
    );
};

export default SelectedTermsBar;