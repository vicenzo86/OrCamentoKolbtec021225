
export interface QuoteItem {
  id: string;
  product: string;
  description: string;
  packagingType: string; // e.g., "Parte A"
  packagingWeight: number;
  pricePerKg: number;
  ipi: number;
  icms: number;
  kits: number;
}

export interface QuoteSupplemental {
  id: string;
  description: string; // e.g., "DIFAL", "ST", "Frete Extra"
  value: number;
}

export interface QuoteSection {
  id: string;
  title: string; // e.g. "Área 1"
  areaSize: number; // e.g. 4950.00
  description: string; // e.g. "de endurecedor de superfície..."
  items: QuoteItem[];
  supplemental: QuoteSupplemental[];
}

export interface ClientData {
  name: string;
  contact: string; // "A/C Sr Ranieri"
  phone: string;
  address: string; // Address line in header
  email: string; // Reference code in PDF? or email
}

export interface CompanyData {
  name: string;
  address: string;
  phone: string;
  email: string;
  site: string;
  logoUrl: string;
  // New fields for Footer/Signatory
  signatoryName: string; // e.g. Eng Vicenzo Agustini
  mobile: string; // e.g. + 55 (47) ...
  secondaryEmail: string; 
}

export interface SupplyConditions {
  payment: string;
  freight: string;
  taxes: string;
  minBilling: string;
  shipping: string;
  validity: string;
}

export interface QuoteData {
  number: string;
  date: string;
  reference: string;
  subject: string;
  client: ClientData;
  sections: QuoteSection[];
  globalExtras: QuoteSupplemental[]; // New field for Freight/Global costs
  company: CompanyData;
  conditions: SupplyConditions;
  notes: string;
}

export const initialQuoteData: QuoteData = {
  number: `KO${new Date().getFullYear().toString().slice(-2)}LB${Math.floor(Math.random() * 9)}`,
  date: new Date().toLocaleDateString('pt-BR'),
  reference: `KO ${new Date().getFullYear()}.11.21 001`,
  subject: "Proposta Comercial Kolbtec",
  client: {
    name: "Cliente Exemplo Ltda",
    contact: "A/C Sr. Responsável",
    phone: "(00) 0000-0000",
    address: "Rua do Cliente, 100 - Cidade - UF",
    email: "contato@cliente.com.br"
  },
  company: {
    name: "Kolbtec Impermeabilizações",
    address: "Endereço da Kolbtec, 000 - Cidade - UF - CEP: 00000-000",
    phone: "+ 55 (00) 0000-0000",
    email: "contato@kolbtec.com.br",
    site: "www.kolbtec.com.br",
    logoUrl: "", // User to upload
    signatoryName: "Representante Kolbtec",
    mobile: "+ 55 (00) 90000-0000",
    secondaryEmail: "vendas@kolbtec.com.br"
  },
  sections: [
    {
      id: '1',
      title: "Área 1",
      areaSize: 100.00,
      description: "Impermeabilização padrão",
      items: [
        {
          id: '101',
          product: "Produto Exemplo",
          description: "Descrição do material aplicado",
          packagingType: "Galão",
          packagingWeight: 18.000,
          pricePerKg: 10.00,
          ipi: 0,
          icms: 0,
          kits: 1
        }
      ],
      supplemental: []
    }
  ],
  globalExtras: [
      { id: 'g1', description: "Frete Total", value: 0 }
  ],
  conditions: {
      payment: "A combinar",
      freight: "CIF / FOB",
      taxes: "Impostos inclusos",
      minBilling: "R$ 1.000,00",
      shipping: "Imediato",
      validity: "15 dias"
  },
  notes: "O consumo de material é teórico, não cabendo a Kolbtec a responsabilidade por variações de consumo devido à variação de espessura, ancoragens, aplicação, imperfeições da superfície ou absorção do substrato, etc."
};