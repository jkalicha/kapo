export interface CarListing {
  id: string
  title: string
  price: number
  currency: 'USD' | 'UYU'
  year: number
  km: number
  transmission: 'Manual' | 'Automático'
  fuel: 'Nafta' | 'Diesel' | 'Híbrido' | 'Eléctrico'
  sellerType: 'Automotora' | 'Particular'
  badge?: 'Destacado' | 'Nuevo ingreso' | 'Precio rebajado'
  location: string
}

export const mockListings: CarListing[] = [
  {
    id: '1',
    title: 'Toyota Corolla XEI',
    price: 18500,
    currency: 'USD',
    year: 2020,
    km: 42000,
    transmission: 'Automático',
    fuel: 'Nafta',
    sellerType: 'Automotora',
    badge: 'Destacado',
    location: 'Montevideo',
  },
  {
    id: '2',
    title: 'Volkswagen Vento Comfortline',
    price: 15900,
    currency: 'USD',
    year: 2019,
    km: 58000,
    transmission: 'Manual',
    fuel: 'Nafta',
    sellerType: 'Particular',
    badge: 'Precio rebajado',
    location: 'Maldonado',
  },
  {
    id: '3',
    title: 'Chevrolet Cruze LTZ',
    price: 21000,
    currency: 'USD',
    year: 2021,
    km: 31000,
    transmission: 'Automático',
    fuel: 'Nafta',
    sellerType: 'Automotora',
    badge: 'Nuevo ingreso',
    location: 'Montevideo',
  },
  {
    id: '4',
    title: 'Renault Sandero Stepway',
    price: 14500,
    currency: 'USD',
    year: 2022,
    km: 18000,
    transmission: 'Manual',
    fuel: 'Nafta',
    sellerType: 'Particular',
    location: 'Canelones',
  },
  {
    id: '5',
    title: 'Toyota Hilux SRV 4x4',
    price: 28000,
    currency: 'USD',
    year: 2018,
    km: 95000,
    transmission: 'Manual',
    fuel: 'Diesel',
    sellerType: 'Automotora',
    badge: 'Destacado',
    location: 'Montevideo',
  },
  {
    id: '6',
    title: 'Peugeot 208 Allure',
    price: 16200,
    currency: 'USD',
    year: 2021,
    km: 27000,
    transmission: 'Manual',
    fuel: 'Nafta',
    sellerType: 'Particular',
    badge: 'Nuevo ingreso',
    location: 'Rivera',
  },
]
