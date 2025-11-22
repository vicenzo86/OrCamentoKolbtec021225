
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
  number: `EI${new Date().getFullYear().toString().slice(-2)}LGM${Math.floor(Math.random() * 9)}`,
  date: new Date().toLocaleDateString('pt-BR'),
  reference: `VA ${new Date().getFullYear()}.11.21 036`,
  subject: "Proposta Comercial Builder",
  client: {
    name: "Brava Pisos",
    contact: "A/C Sr Ranieri",
    phone: "(47) 99148 0070",
    address: "Av Frederico A Ritter, 3670 - Cachoeirinha – RS",
    email: "contato@bravapisos.com.br"
  },
  company: {
    name: "Builder Indústria e Comércio",
    address: "Av Frederico A Ritter, 3670 - Cachoeirinha – RS - CEP: 94930-598",
    phone: "+ 55 (51) 3471-1289",
    email: "vendas@builder.com.br",
    site: "www.builder.ind.br",
    logoUrl: "https://via.placeholder.com/300x100?text=Builder+Logo", // Placeholder, user can upload
    signatoryName: "Eng Vicenzo Agustini",
    mobile: "+ 55 (47) 99215-4118",
    secondaryEmail: "vicenzo.agustini@builder.ind.br"
  },
  sections: [
    {
      id: '1',
      title: "Área 1",
      areaSize: 4950.00,
      description: "de endurecedor de superfície Duratop SD, com consumo aproximado de 120g/m².",
      items: [
        {
          id: '101',
          product: "Duratop SD",
          description: "Endurecedor de Superfície para piso",
          packagingType: "Parte A",
          packagingWeight: 231.000,
          pricePerKg: 4.55,
          ipi: 0,
          icms: 17,
          kits: 3
        }
      ],
      supplemental: []
    },
    {
        id: '2',
        title: "Área 2",
        areaSize: 4950.00,
        description: "de endurecedor de superfície Duratop Fórmula, com consumo aproximado de 100g/m².",
        items: [
          {
            id: '102',
            product: "Duratop Fórmula",
            description: "Endurecedor de Superfície para piso",
            packagingType: "Parte A",
            packagingWeight: 248.000,
            pricePerKg: 32.11,
            ipi: 0,
            icms: 17,
            kits: 2
          }
        ],
        supplemental: []
      }
  ],
  globalExtras: [
      { id: 'g1', description: "Frete Total", value: 0 }
  ],
  conditions: {
      payment: "28 DD após aprovação do cadastro",
      freight: "FOB fábrica Cachoeirinha/RS",
      taxes: "ICMS incluso do preço, IPI conforme tabela, cliente não contribuinte.",
      minBilling: "R$ 3.000,00",
      shipping: "Conforme programação",
      validity: "30/11/2025"
  },
  notes: "O consumo de material é teórico, não cabendo a Builder a responsabilidade por variações de consumo devido à variação de espessura, ancoragens, aplicação, imperfeições da superfície ou absorção do substrato, etc.\n\nEsta compra é realizada por pessoa juridica, em operação interestadual, e por tal razão poderá ser cobrado um diferencial de aliquota de ICMS pelo Estado de destino da mercadoria. Essa obrigação legal está prevista em legislação tributária e é de responsabilidade da pessoa juridica compradora, razão pela qual a Builder não se responsabiliza pelo pagamento e/ou liberação do produto, caso haja cobrança e/ou retenção do mesmo em barreiras fiscais."
};
