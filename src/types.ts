export type AccountMember = {
  avenueAccount?: string,
  cpf: string,
  expires: string,
}

export type UserData = {
  allowManageMembers: boolean,
  email: string,
  limit: string,
  settings?: { provisionedIrrfDT: boolean, provisionedIrrfST: boolean }
  termsAccepted: boolean,
  userDoc: string,
}

export type NoteTrade = {
  BS: 'C' | 'V',
  DC: 'C' | 'D',
  dlombelloOperationType?: 'C' | 'V' | 'DT' | 'AJ.POS' | 'EX.OPC' | 'EX.OPV',
  fees?: { brokerageTax: number, tran: number, others: number },
  itemTotal: number,
  marketType: string,
  obs: string,
  price: number,
  quantity: number,
  securities: string,
  time: string,
}

export type Note = {
  _errorCode?: number,
  allFees: number,
  ANATax: number,
  avenueAccount?: string,
  bovespaOthers: number,
  bovespaTotal: number,
  brokerageTax: number,
  brokerName: string,
  CBLC: number,
  clearing: number,
  currency: 'BRL' | 'USD',
  date: string,
  emolument: number,
  futureNetAmount: number,
  IRRF: number,
  irrfDtProvisioned: number,
  irrfStProvisioned: number,
  ISSTax: number,
  netAmount: number,
  number: string,
  optionsTax: number,
  registrationTax: number,
  settlementTax: number,
  showNote: boolean,
  trades: NoteTrade[],
  type: 'Bovespa' | 'BMF' | 'Avenue',
}
