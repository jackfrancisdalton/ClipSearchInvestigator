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
        <div style={{ display: 'flex', gap: '10px', marginTop: "0", marginBottom: "15px"}}>
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