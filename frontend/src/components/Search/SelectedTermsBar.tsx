import React, { useState } from 'react';

interface SelectedTermsBarParams {
    terms: string[];
    onTermClick: (term: string, isActive: boolean) => void;
}

const SelectedTermsBar: React.FC<SelectedTermsBarParams> = ({ terms, onTermClick }) => {
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
        <div className="flex items-center gap-2 p-4 mt-0 mb-4 rounded-lg bg-background-light">
            <span className="mr-4">Filter by term:</span>
            {terms.map(term => (
            <div
                key={term}
                onClick={() => handleTermClick(term)}
                className={`p-2 rounded-lg ${activeTerms.includes(term) ? 'bg-primary-medium' : 'bg-primary-300'}`}
            >
                {term}
            </div>
            ))}
        </div>
    );
};

export default SelectedTermsBar;