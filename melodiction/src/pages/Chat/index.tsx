import React from 'react';
import { useMelodyStore } from '../../store/melodyStore';

const MelodyPage: React.FC = () => {
    const { selectedMelody } = useMelodyStore();

    if (!selectedMelody) {
        return <div>Mélodie non trouvée</div>;
    }

    return (
        <div>
            <h2>{selectedMelody.getName()}</h2>
            <p>{selectedMelody.getMelodyText()}</p>
            {/* Vous pouvez ajouter plus d'informations sur la mélodie ici si nécessaire */}
        </div>
    );
};

export default MelodyPage;
