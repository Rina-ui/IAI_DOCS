import { DataSource } from 'typeorm';
import { SubjectOrmEntity } from '../entities/subject.orm-entity';
import { v4 as uuidv4 } from 'uuid';

export const IAI_SUBJECTS = [

    // ─── TC1
    { name: 'Programmation Orientée Objet (Java)', filiere: 'TC1', description: 'Java, héritage, polymorphisme, design patterns' },
    { name: 'Développement Web ', filiere: 'TC1', description: 'HTML, CSS, JavaScript' },
    { name: 'Génie Logiciel', filiere: 'TC1', description: 'UML, méthodes de développement, tests' },
    { name: 'CCNA 1a ', filiere: 'COMMUN', description: 'TCP/IP, protocoles, topologies' },
    { name: 'CCNA 1b ', filiere: 'COMMUN', description: 'TCP/IP, protocoles, topologies' },
    { name: 'Bases de Données', filiere: 'TC1', description: 'SQL, modélisation, SGBD' },
    { name: 'Anglais Technique', filiere: 'TC1', description: 'Anglais appliqué à l\'informatique' },
    { name: 'Programmation C', filiere: 'TC1', description: 'Langage C, pointeurs, mémoire' },
    { name: 'Analyse Math', filiere: 'TC1', description: 'Analyse' },
    { name: 'Math Discrete', filiere: 'TC1', description: 'Analyse, algèbre' },
    { name: 'Algorithmique et Structures de Données', filiere: 'TC1', description: 'Algorithmes fondamentaux et structures de données' },
    { name: 'Architecture des Ordinateurs', filiere: 'TC1', description: 'Organisation matérielle, assembleur' },
    { name: 'Systèmes d\'Exploitation', filiere: 'TC1', description: 'Linux, processus, threads, mémoire' },
    { name: 'Communication et Expression', filiere: 'TC1', description: 'Rédaction, présentation' },
    { name: 'Gestion de Projets', filiere: 'TC1', description: 'Méthodes agiles, planification' },

    // ─── TC2
    { name: 'Comptabilité Générale', filiere: 'TC2', description: 'Bilan, compte de résultat, journaux' },
    { name: 'Droit ', filiere: 'TC2', description: 'droit ' },
    { name: 'Économie d\'Entreprise', filiere: 'TC2', description: 'Microéconomie, macroéconomie appliquée' },
    { name: 'Comptabilite', filiere: 'TC2', desciption: 'OHADA' },
    { name: 'Analyse et Conception (UML)', filiere: 'GLSI', description: ' UML, cas d\'utilisation' },
    { name: 'Mobile Development', filiere: 'TC2', description: 'Android, Flutter, React Native' },
    { name: 'CCNA2 ', filiere: 'TC2', description: 'TCP/IP, protocoles, topologies' },
    { name: 'Anglais Technique', filiere: 'TC2', description: 'Anglais appliqué à l\'informatique' },
    { name: 'Methodes Agiles', filiere: 'TC2', description: 'scrum, jira' },
    { name: 'Statistiques', filiere: 'TC2', description: 'statistiques' },
    { name: 'Probabiltes', filiere: 'TC2', description: 'proba' },
    { name: 'Algebre lineaire', filiere: 'TC2', description: 'Algebre lineaire' },
    { name: 'Merise', filiere: 'TC2', description: 'Diagrammes' },
    { name: 'Cryptographie', filiere: 'TC2', description: 'cryptographie' },
    { name: 'Securite informatique', filiere: 'TC2', description: 'securite informatique' },
    { name: 'Cloud Computing', filiere: 'TC2', description: 'AWS, Azure, GCP, infrastructure as code' },


    // ─── GLSI
    { name: 'Genie logiciel', filiere: 'GLSI', description: 'UML, cas d\'utilisation' },
    { name: 'Programmation Avancée ', filiere: 'GLSI', description: 'Python, data structures, OOP' },
    { name: 'Développement Mobile Avancé', filiere: 'GLSI', description: 'Flutter avancé, intégration API' },
    { name: 'Intelligence Artificielle', filiere: 'GLSI', description: 'Machine learning, deep learning, NLP' },
    { name: 'Multimedia', filiere: 'GLSI', description: 'M' },
    { name: 'Analyse de donnees', filiere: 'GLSI', description: 'Machine learning, deep learning, NLP' },
    { name: 'Gestion d\'outil de programmation', filiere: 'GLSI', description: 'Machine learning, deep learning, NLP' },
    { name: 'Audit informatique', filiere: 'GLSI', description: 'Machine learning, deep learning, NLP' },
    { name: 'Intelligence Artificielle', filiere: 'GLSI', description: 'Machine learning, deep learning, NLP' },
    { name: 'Creation d\'entreprise', filiere: 'GLSI', description: 'creation d\'entreprise' },
    { name: 'droit du travail', filiere: 'GLSI', description: 'contrat, conges' },

    // ─── ASR
    { name: 'Anglais expert', filiere: 'ASR', description: 'Communication professionnelle, vocabulaire technique IT' },
    { name: 'Administration et sécurité réseau', filiere: 'ASR', description: 'Configuration réseau, sécurisation des infrastructures' },
    { name: 'Administration et sécurité systèmes', filiere: 'ASR', description: 'Gestion des systèmes et sécurité informatique' },
    { name: 'Programmation système', filiere: 'ASR', description: 'Programmation bas niveau, gestion des processus' },
    { name: 'Sécurité des réseaux', filiere: 'ASR', description: 'Protection des réseaux, attaques et défenses' },
    { name: 'CCNA 3', filiere: 'ASR', description: 'Routage avancé, switching et concepts Cisco' },
    { name: 'Huawei', filiere: 'ASR', description: 'Technologies réseau Huawei, configuration et maintenance' },
    { name: 'Audit des systèmes informatiques', filiere: 'ASR', description: 'Analyse, contrôle et évaluation des systèmes IT' },
    { name: 'Création d’entreprise', filiere: 'ASR', description: 'Entrepreneuriat, gestion de projet et business plan' },
    { name: 'Système d’exploitation avancés', filiere: 'ASR', description: 'Fonctionnement avancé des OS, optimisation et sécurité' },
    { name: 'Architecture reseau avancée', filiere: 'ASR', description: 'Conception d’architectures réseau complexes' },
    { name: 'Fibre optique', filiere: 'ASR', description: 'Transmission optique, installation et maintenance' },
    { name: 'Droit du travail', filiere: 'ASR', description: 'Réglementation du travail et aspects juridiques' },
];

export async function seedSubjects(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(SubjectOrmEntity);

    for (const subject of IAI_SUBJECTS) {
        // On vérifie si la matière existe déjà avant d'insérer
        const exists = await repo.findOne({ where: { name: subject.name } });
        if (!exists) {
            const entity = new SubjectOrmEntity();
            entity.id = uuidv4();
            entity.name = subject.name;
            entity.filiere = subject.filiere;
            // @ts-ignore
            entity.description = subject.description;
            await repo.save(entity);
            console.log(`✅ Matière ajoutée : ${subject.name} (${subject.filiere})`);
        }
    }
    console.log('🎓 Seeding des matières IAI terminé !');
}