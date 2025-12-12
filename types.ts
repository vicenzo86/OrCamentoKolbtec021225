
export interface QuoteItem {
  id: string;
  serviceName: string;
  description: string;
  unit: string; 
  packaging: string; 
  quantity: number; 
  unitPrice: number; 
  taxIpi: number; 
  taxIcms: number; 
  kits: number;
}

export interface QuoteSection {
  id: string;
  title: string;
  areaSize: number; 
  description: string; 
  consumption: string; 
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
  number: `KT ${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${String(new Date().getDate()).padStart(2, '0')} 001`,
  date: new Date().toLocaleDateString('pt-BR'),
  reference: `REF ${new Date().getFullYear()}/001`,
  subject: "PROPOSTA DE IMPERMEABILIZAÇÃO",
  salutation: "Prezado Cliente,",
  introText: "Agradecemos a oportunidade de apresentar nossa proposta comercial para os serviços e materiais descritos abaixo:",
  client: {
    name: "Empresa Exemplo LTDA",
    contact: "A/C Sr. Responsável",
    phone: "(48) 99999-9999",
    address: "Florianópolis, SC",
    email: "cliente@exemplo.com.br"
  },
  company: {
    name: "Kolbtec Soluções em Impermeabilização",
    address: "R. Profa. Rosinha Campos, 93 - Abraão, Florianópolis - SC, 88085-160",
    phone: "(48) 3024-6909",
    email: "kolbtec@kolbtec.com.br",
    site: "www.kolbtec.com.br",
    logoUrl: "",
    signatoryName: "Departamento Comercial",
    mobile: "(48) 3024-6909",
    secondaryEmail: "kolbtec@kolbtec.com.br"
  },
  sections: [
    {
      id: '1',
      title: "Área 1",
      areaSize: 100.00,
      description: "IMPERMEABILIZAÇÃO COM MANTA ASFÁLTICA",
      consumption: "",
      items: [
        {
          id: '101',
          serviceName: "SERVIÇO DE IMPERMEABILIZAÇÃO",
          description: "",
          unit: "M²",
          packaging: "",
          quantity: 100,
          unitPrice: 85.50,
          taxIpi: 0,
          taxIcms: 0,
          kits: 1
        }
      ]
    }
  ],
  conditions: {
      payment: "A combinar",
      freight: "Incluso",
      taxes: "Inclusos",
      minBilling: "R$ 500,00",
      shipping: "Imediato",
      validity: "10 dias"
  },
  notes: "O consumo de material é estimado, podendo variar conforme as condições do substrato e aplicação no local. A garantia dos serviços é de 05 anos conforme normas vigentes."
};
