import { Trade } from "./types";
import { lockEscrow, releaseEscrow } from "./escrow";
import { credit } from "./wallet";
import { record } from "./ledger";

export async function processTrade(trade: Trade): Promise<Trade> {
  record({ type: "trade_created", trade });

  const escrow = lockEscrow(trade);
  trade.status = "locked";
  trade.escrowId = escrow.id;

  record({ type: "escrow_locked", escrow });

  trade.status = "processing";

  trade.status = "settled";

  releaseEscrow(escrow.id);

  credit(trade.userId, trade.amount);
  trade.walletDelta = trade.amount;

  record({ type: "trade_settled", trade });

  return trade;
}
