import { IPerson } from "./i-person";

export interface IUser {
    UserId: string,
    PersonId: string,
    Email: string,
    Password: string,
    Situation: string,
    FunctionUser: string,
    Person: IPerson
}