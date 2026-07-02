export type TradeStatus =
  | "created"
  | "locked"
  | "processing"
  | "settled"
  | "failed";

export interface Trade {
  id: string;
  userId: string;

  asset: string;
  amount: number;
  price: number;

  status: TradeStatus;

  escrowId?: string;
  walletDelta?: number;

  createdAt: string;
  updatedAt: string;
}
