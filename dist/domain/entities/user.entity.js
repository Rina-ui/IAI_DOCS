"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teacher = exports.Student = exports.Admin = exports.User = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["STUDENT"] = "student";
    UserRole["TEACHER"] = "teacher";
})(UserRole || (exports.UserRole = UserRole = {}));
class User {
    id;
    email;
    passwordHash;
    firstName;
    lastName;
    role;
    constructor(id, email, passwordHash, firstName, lastName, role) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
exports.User = User;
class Admin extends User {
    constructor(id, email, passwordHash, firstName, lastName) {
        super(id, email, passwordHash, firstName, lastName, UserRole.ADMIN);
    }
}
exports.Admin = Admin;
class Student extends User {
    level;
    points;
    constructor(id, email, passwordHash, firstName, lastName, level, points = 0) {
        super(id, email, passwordHash, firstName, lastName, UserRole.STUDENT);
        this.level = level;
        this.points = points;
    }
    addPoints(amount) {
        if (amount < 0)
            throw new Error('Amount must be greater than 0');
        this.points += amount;
    }
}
exports.Student = Student;
class Teacher extends User {
    speciality;
    verified;
    constructor(id, email, passwordHash, firstName, lastName, speciality, verified = false) {
        super(id, email, passwordHash, firstName, lastName, UserRole.TEACHER);
        this.speciality = speciality;
        this.verified = verified;
    }
}
exports.Teacher = Teacher;
//# sourceMappingURL=user.entity.js.map