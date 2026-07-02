const balances = new Map<string, number>();

export function getBalance(userId: string) {
  return balances.get(userId) || 0;
}

export function credit(userId: string, amount: number) {
  const current = getBalance(userId);
  balances.set(userId, current + amount);
}

export function debit(userId: string, amount: number) {
  const current = getBalance(userId);
  balances.set(userId, current - amount);
}
