"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
let AiService = class AiService {
    async generateCorrection(questions, totalScore, maxScore) {
        const percentage = Math.round((totalScore / maxScore) * 100);
        const passed = percentage >= 50;
        const explanation = passed
            ? `Bon travail ! Tu as obtenu ${totalScore}/${maxScore} points (${percentage}%). Continue à t'entraîner pour améliorer encore tes résultats.`
            : `Tu as obtenu ${totalScore}/${maxScore} points (${percentage}%). ` +
                `Revois les chapitres correspondants et réessaie.`;
        return { explanation, feedback: passed ? 'Réussi' : 'À revoir' };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)()
], AiService);
//# sourceMappingURL=ai.service.js.map