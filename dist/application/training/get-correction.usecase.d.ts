import * as correctionRepository from '../../domain/repositories/correction.repository';
export declare class GetCorrectionUseCase {
    private correctionRepo;
    constructor(correctionRepo: correctionRepository.ICorrectionRepository);
    execute(trainingId: string): Promise<import("../../domain/entities/correction.entity").Correction>;
}
