import { promises as fs } from "fs";
import type { ILoan } from "../interfaces/loans.interface.ts";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Rutas necesarias para encontrar el archivo loans.json
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const filePath = join(__dirname, "../models/loans.json");

// Leer todos los libros
const getLoansService = async (): Promise<ILoan[]> => {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as ILoan[];
};

// Buscar libro por ID
const getLoanByIdService = async (loanId: number): Promise<ILoan | null> => {
    const loans = await getLoansService();
    return loans.find((l) => l.loanId === loanId) ?? null;
};

// Crear nuevo libro
const postLoanService = async (
    loanData: Omit<ILoan, "loanId">
): Promise<ILoan> => {
    const loans = await getLoansService();

    const newLoan: ILoan = {
        loanId: (loans[loans.length - 1]?.loanId ?? 0) + 1, // autoincremental
        ...loanData,
    };

    loans.push(newLoan);
    await fs.writeFile(filePath, JSON.stringify(loans, null, 2));
    return newLoan;
};

// Actualizar libro
const updateLoanService = async (
    loanId: number,
    loanData: Partial<ILoan>
): Promise<ILoan | null> => {
    const loans = await getLoansService();
    const index = loans.findIndex((l) => l.loanId === loanId);
    if (index === -1) return null;

    const existing = loans[index]
    if (!existing) {
        return null
    }

    const updatedLoan: ILoan = { ...existing, ...loanData, loanId: existing.loanId };
    loans[index] = updatedLoan
    await fs.writeFile(filePath, JSON.stringify(loans, null, 2));
    return updatedLoan;
};

// Eliminar libro
const deleteLoanService = async (loanId: number): Promise<boolean> => {
    const loans = await getLoansService();
    const index = loans.findIndex((l) => l.loanId === loanId);
    if (index === -1) return false;

    loans.splice(index, 1);
    await fs.writeFile(filePath, JSON.stringify(loans, null, 2));
    return true;
};

export {
    getLoansService,
    getLoanByIdService,
    postLoanService,
    updateLoanService,
    deleteLoanService
};
