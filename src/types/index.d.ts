export type AccountMember = {
  usaAccounts: string[];
  cpf: string;
  expires: string;
};

export type UserData = {
  allowManageMembers: boolean;
  email: string;
  limit: string;
  settings?: {
    provisionedIrrfDT?: boolean;
    provisionedIrrfST?: boolean;
    groupByTicker?: boolean;
    removeOptionDT?: boolean;
    hidePaymentNotification?: boolean;
    readonly hidePaymentNotificationUntil?: string;
  };
  termsAccepted: boolean;
  userDoc: string;
  expiresIn: string;
  isFreePlan: boolean;
};

export type NoteTrade = {
  BS: 'C' | 'V';
  DC: 'C' | 'D';
  dlombelloOperationType?: 'C' | 'V' | 'DT' | 'AJ.POS' | 'EX.OPC' | 'EX.OPV';
  fees?: { brokerageTax: number; tran: number; others: number };
  itemTotal: number;
  marketType: string;
  obs: string;
  originalSymbol?: string;
  price: number;
  quantity: number;
  symbol: string;
  time: string;
};

export type Note = {
  _error: boolean;
  _errorCode?: number;
  _messages: string[];
  _noteReadCompletely: boolean;
  _page?: number;
  allFees: number;
  ANATax: number;
  usaAccount?: string;
  bovespaOthers: number;
  bovespaTotal: number;
  brokerageTax: number;
  brokerName: string;
  CBLC: number;
  clearing: number;
  cpf: string;
  currency: 'BRL' | 'USD';
  date: string;
  emolument: number;
  fileName: string;
  futureNetAmount: number;
  IRRF: number;
  irrfDtProvisioned: number;
  irrfStProvisioned: number;
  ISSTax: number;
  netAmount: number;
  number: string;
  optionsTax: number;
  proofIsValid: boolean;
  registrationTax: number;
  settlementTax: number;
  showNote: boolean;
  trades: NoteTrade[];
  tradesTotal: number;
  type: 'Bovespa' | 'BMF' | 'USA';
  isFakeNumber?: boolean;
};

export type NoteDetails = Note & { showNote: boolean };

export type NoteError = Pick<Note, '_messages' | '_page' | 'fileName' | 'number'>;

export type UserTransactions = {
  results: boolean;
  response: {
    desc: string;
    dateApproved: string;
    email: string;
    lockedUserDoc: string;
    paymentNumber: number;
    reference: string;
    inUse: boolean;
  }[];
};
