export type Filiere = 'TC1' | 'TC2' | 'GLSI' | 'ASR' | 'COMMUN';

export class Subject {
    constructor(
        public readonly id: string,
        public name: string,
        public filiere: Filiere,
        public description: string,
    ) {}
}