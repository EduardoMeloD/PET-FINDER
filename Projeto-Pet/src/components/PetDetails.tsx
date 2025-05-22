import React from 'react';

interface PetDetailsProps {
    pet: any;
    isOpen: boolean;
    onClose: () => void;
}

export function PetDetails({pet, isOpen, onClose}: PetDetailsProps){
    if(!isOpen || !pet) return null;

    return (
        <div style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
            <div style={{
            background: "#fff", padding: 24, borderRadius: 8, minWidth: 300, maxWidth: 400, position: "relative"
            }}>
            <button onClick={onClose} style={{ position: "absolute", top: 8, right: 8 }}>X</button>
            <h2>Detalhes do Pet</h2>
            {pet.fotoUrl && <img src={pet.fotoUrl} alt={pet.nome} style={{ maxWidth: "100%" }} />}
            <p><strong>Nome:</strong> {pet.nomePet}</p>
            <p><strong>Espécie:</strong> {pet.tipo}</p>
            <p><strong>Código do Pet:</strong> {pet.petCode}</p>
            <p><strong>Raça:</strong> {pet.raca}</p>
            <p><strong>Sexo:</strong> {pet.sexo}</p>
            <p><strong>Data de Cadastro:</strong> {pet.dataCadastro}</p>
            <p><strong>Descrição:</strong> {pet.descricao}</p>
            {/* Adicione outros campos conforme necessário */}
            </div>
        </div>
        );
}
