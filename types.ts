
export interface QuoteItem {
  id: string;
  serviceName: string;
  description: string;
  unit: string; 
  packaging: string; // Ex: Parte A 231,000 kg
  quantity: number; // Quantidade total em kg
  unitPrice: number; // R$ / kg
  taxIpi: number; // %
  taxIcms: number; // %
  kits: number;
}

export interface QuoteSupplemental {
  id: string;
  description: string;
  value: number;
}

export interface QuoteSection {
  id: string;
  title: string;
  areaSize: number; 
  description: string; 
  consumption: string; // Ex: 120g/m²
  items: QuoteItem[];
}

export interface ClientData {
  name: string;
  contact: string;
  phone: string;
  address: string;
  email: string;
}

export interface CompanyData {
  name: string;
  address: string;
  phone: string;
  email: string;
  site: string;
  logoUrl: string;
  signatoryName: string;
  mobile: string;
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

export interface ServiceDB {
  servico: string;
  unidade: string;
  valor: number;
  escopo?: string;
  embalagem?: string;
}

export interface QuoteData {
  number: string;
  date: string;
  reference: string;
  subject: string;
  salutation: string;
  introText: string;
  client: ClientData;
  sections: QuoteSection[];
  company: CompanyData;
  conditions: SupplyConditions;
  notes: string;
}

export const initialQuoteData: QuoteData = {
  number: `VA ${new Date().getFullYear()}.11.21 036`,
  date: new Date().toLocaleDateString('pt-BR'),
  reference: `VA 2025.11.21 036`,
  subject: "Proposta Comercial Builder",
  salutation: "Prezado Sr Ranieri",
  introText: "Conforme solicitado, enviamos abaixo nossa proposta de materiais, conforme descrição abaixo:",
  client: {
    name: "Brava Pisos",
    contact: "A/C Sr Ranieri",
    phone: "(47) 99148 0070",
    address: "",
    email: ""
  },
  company: {
    name: "Builder Indústria e Comércio",
    address: "Av Frederico A Ritter, 3670 - Cachoeirinha - RS - CEP: 94930-598",
    phone: "+ 55 (51) 3471-1289",
    email: "",
    site: "www.builder.ind.br",
    logoUrl: "",
    signatoryName: "Departamento Comercial",
    mobile: "",
    secondaryEmail: ""
  },
  sections: [
    {
      id: '1',
      title: "Área 1",
      areaSize: 4950.00,
      description: "endurecedor de superfície Duratop SD",
      consumption: "120g/m²",
      items: [
        {
          id: '101',
          serviceName: "Duratop SD",
          description: "Endurecedor de Superfície para piso",
          unit: "kg",
          packaging: "Parte A 231,000 kg",
          quantity: 693.000,
          unitPrice: 4.55,
          taxIpi: 0,
          taxIcms: 17,
          kits: 3
        }
      ]
    }
  ],
  conditions: {
      payment: "A combinar",
      freight: "CIF",
      taxes: "Inclusos",
      minBilling: "R$ 500,00",
      shipping: "7 dias",
      validity: "10 dias"
  },
  notes: "O consumo de material é teórico, não cabendo a Builder a responsabilidade por variações de consumo devido à variação de espessura, ancoragens, aplicação, imperfeições da superfície ou absorção do substrato, etc."
};
