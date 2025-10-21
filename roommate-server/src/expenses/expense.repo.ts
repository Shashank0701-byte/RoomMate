import { Expense } from "@generated/prisma";
import ExpenseDto from "@src/common/dtos/ExpenseDto";
import prisma from "@src/common/utils/prisma";

export class ExpenseRepo {
  static async create(expense: ExpenseDto) {
    return await prisma.expense.create({
      data: expense as Expense,
    });
  }

  static async getExpensesByHouseholdId(householdId: string) {
    return await prisma.expense.findMany({
      where: { householdId: householdId },
      include: {
        paidBy: {
          select: {
            name: true,
            userId: true,
          },
        },
      },
    });
  }

  static async getExpenseByExpenseId(expenseId: string) {
    return await prisma.expense.findUnique({
      where: { expenseId: expenseId },
      include: {
        paidBy: {
          select: {
            name: true,
            userId: true,
          },
        },
      },
    });
  }

  static async delete(expenseId: string) {
    return await prisma.$transaction(async (tx) => {
      await tx.expenseSplit.deleteMany({
        where: { expenseId: expenseId },
      });

      return await tx.expense.delete({
        where: { expenseId: expenseId },
      });
    });
  }

  static async getExpensesWithSplits(householdId: string) {
    return await prisma.expense.findMany({
      where: { householdId },
      include: {
        paidBy: {
          select: {
            userId: true,
            name: true,
          },
        },
        splits: {
          include: {
            user: {
              select: {
                userId: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
