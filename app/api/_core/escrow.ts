const escrowStore = new Map<string, any>();

export function lockEscrow(trade: any) {
  const escrowId = `esc_${trade.id}`;

  const escrow = {
    id: escrowId,
    tradeId: trade.id,
    userId: trade.userId,
    amount: trade.amount,
    status: "locked",
    createdAt: new Date().toISOString(),
  };

  escrowStore.set(escrowId, escrow);

  return escrow;
}

export function releaseEscrow(escrowId: string) {
  const escrow = escrowStore.get(escrowId);
  if (!escrow) return null;

  escrow.status = "released";
  escrowStore.set(escrowId, escrow);

  return escrow;
}
