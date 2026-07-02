const ledger: any[] = [];

export function record(event: any) {
  ledger.push({
    ...event,
    ts: new Date().toISOString(),
  });
}

export function getLedger() {
  return ledger;
}
