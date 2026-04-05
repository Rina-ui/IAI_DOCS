"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
class Email {
    value;
    constructor(email) {
        if (!this.isValid(email)) {
            throw new Error(`Invalid email: ${email}`);
        }
        this.value = email.toLowerCase();
    }
    isValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    toString() {
        return this.value;
    }
    equals(other) {
        return this.value === other.value;
    }
}
exports.Email = Email;
//# sourceMappingURL=email.vo.js.map