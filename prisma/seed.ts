import { config } from 'dotenv'
config({ path: '.env.local' })
config()

import { PrismaClient, Role, SellerType, ListingStatus, FuelType, Transmission, Currency, BoostStatus } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

async function main(): Promise<void> {
  // ------------------------------------------------------------------
  // 1. Clean up in reverse dependency order
  // ------------------------------------------------------------------
  await db.$transaction([
    db.featuredBoost.deleteMany(),
    db.lead.deleteMany(),
    db.listingImage.deleteMany(),
    db.listing.deleteMany(),
    db.sellerProfile.deleteMany(),
    db.account.deleteMany(),
    db.session.deleteMany(),
    db.user.deleteMany(),
  ])
  console.log('✓ Deleted existing data')

  // ------------------------------------------------------------------
  // 2. Hash a shared test password
  // ------------------------------------------------------------------
  const hashedPassword = await bcrypt.hash('Kapo2025!', 10)

  // ------------------------------------------------------------------
  // 3. Create users: 1 admin + 3 dealership sellers + 2 private sellers
  // ------------------------------------------------------------------
  const adminUser = await db.user.create({
    data: {
      email: 'admin@kapo.uy',
      name: 'Admin Kapo',
      role: Role.ADMIN,
      emailVerified: true,
      accounts: {
        create: {
          accountId: 'admin@kapo.uy',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  })

  // Dealership 1 — Automotora del Este
  const dealer1User = await db.user.create({
    data: {
      email: 'ventas@automotoraeleste.uy',
      name: 'Marcelo Barrios',
      role: Role.SELLER,
      emailVerified: true,
      accounts: {
        create: {
          accountId: 'ventas@automotoraeleste.uy',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  })

  // Dealership 2 — Car Center Montevideo
  const dealer2User = await db.user.create({
    data: {
      email: 'info@carcenter.com.uy',
      name: 'Gabriela Sosa',
      role: Role.SELLER,
      emailVerified: true,
      accounts: {
        create: {
          accountId: 'info@carcenter.com.uy',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  })

  // Dealership 3 — AutoUruguay
  const dealer3User = await db.user.create({
    data: {
      email: 'contacto@autouruguay.uy',
      name: 'Diego Fernández',
      role: Role.SELLER,
      emailVerified: true,
      accounts: {
        create: {
          accountId: 'contacto@autouruguay.uy',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  })

  // Private seller 1
  const private1User = await db.user.create({
    data: {
      email: 'pcarrasco@gmail.com',
      name: 'Pablo Carrasco',
      role: Role.SELLER,
      emailVerified: true,
      accounts: {
        create: {
          accountId: 'pcarrasco@gmail.com',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  })

  // Private seller 2
  const private2User = await db.user.create({
    data: {
      email: 'laura.mendez@hotmail.com',
      name: 'Laura Méndez',
      role: Role.SELLER,
      emailVerified: true,
      accounts: {
        create: {
          accountId: 'laura.mendez@hotmail.com',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  })

  console.log('✓ Created 6 users (1 admin, 3 dealerships, 2 private)')

  // ------------------------------------------------------------------
  // 4. Create seller profiles
  // ------------------------------------------------------------------
  const seller1 = await db.sellerProfile.create({
    data: {
      userId: dealer1User.id,
      type: SellerType.DEALERSHIP,
      businessName: 'Automotora del Este',
      phone: '+598 42 312 450',
      whatsapp: '+59842312450',
      city: 'Maldonado',
      department: 'Maldonado',
      description: 'Concesionaria familiar con más de 20 años en el mercado de usados del Este. Especialistas en vehículos japoneses y europeos.',
      website: 'https://automotoraeleste.uy',
      verified: true,
    },
  })

  const seller2 = await db.sellerProfile.create({
    data: {
      userId: dealer2User.id,
      type: SellerType.DEALERSHIP,
      businessName: 'Car Center Montevideo',
      phone: '+598 2 709 8800',
      whatsapp: '+59827098800',
      city: 'Montevideo',
      department: 'Montevideo',
      description: 'Automotora líder en Montevideo con stock rotativo de más de 60 vehículos. Financiación propia disponible.',
      website: 'https://carcenter.com.uy',
      verified: true,
    },
  })

  const seller3 = await db.sellerProfile.create({
    data: {
      userId: dealer3User.id,
      type: SellerType.DEALERSHIP,
      businessName: 'AutoUruguay',
      phone: '+598 73 200 100',
      whatsapp: '+59873200100',
      city: 'Salto',
      department: 'Salto',
      description: 'Referentes del litoral uruguayo. Compramos, vendemos y permutamos. Gestión de trámites incluida.',
      verified: true,
    },
  })

  const seller4 = await db.sellerProfile.create({
    data: {
      userId: private1User.id,
      type: SellerType.PRIVATE,
      phone: '+598 99 612 345',
      whatsapp: '+59899612345',
      city: 'Canelones',
      department: 'Canelones',
      description: 'Particular, vendo por viaje. Todo en regla.',
      verified: false,
    },
  })

  const seller5 = await db.sellerProfile.create({
    data: {
      userId: private2User.id,
      type: SellerType.PRIVATE,
      phone: '+598 98 755 432',
      whatsapp: '+59898755432',
      city: 'Paysandú',
      department: 'Paysandú',
      description: 'Particular. Único dueño, mantenimiento al día.',
      verified: false,
    },
  })

  // ------------------------------------------------------------------
  // 5. Create 18 listings
  // ------------------------------------------------------------------

  // Helper: build placehold.co URLs with variant param
  const img = (n: number) =>
    `https://placehold.co/800x600/1a1a1a/F5A623?text=KAPO&v=${n}`

  // Split into per-seller transactions to stay under Neon's pooled connection timeout
  const listings = await db.$transaction(async (tx) => {
    // --- seller1 (Automotora del Este) — 5 listings ---
    const l1 = await tx.listing.create({
      data: {
        sellerId: seller1.id,
        status: ListingStatus.ACTIVE,
        brand: 'Toyota',
        model: 'Corolla',
        version: '2.0 XEI CVT',
        year: 2022,
        km: 38000,
        price: 24500,
        currency: Currency.USD,
        fuel: FuelType.NAFTA,
        transmission: Transmission.AUTOMATICO,
        color: 'Blanco',
        doors: 4,
        description: 'Impecable, service en concesionaria. Airbags, ABS, cámara de retroceso.',
        city: 'Maldonado',
        department: 'Maldonado',
        featured: true,
        acceptsTrade: true,
        hasFinancing: true,
        images: {
          create: [
            { url: img(101), order: 0 },
            { url: img(102), order: 1 },
            { url: img(103), order: 2 },
          ],
        },
      },
    })

    const l2 = await tx.listing.create({
      data: {
        sellerId: seller1.id,
        status: ListingStatus.ACTIVE,
        brand: 'Honda',
        model: 'HR-V',
        version: 'EX CVT',
        year: 2021,
        km: 52000,
        price: 22000,
        currency: Currency.USD,
        fuel: FuelType.NAFTA,
        transmission: Transmission.AUTOMATICO,
        color: 'Plata',
        doors: 4,
        description: 'SUV compacta en perfecto estado. Pantalla táctil, Honda Sensing, techo solar.',
        city: 'Maldonado',
        department: 'Maldonado',
        featured: false,
        hasFinancing: true,
        images: {
          create: [
            { url: img(201), order: 0 },
            { url: img(202), order: 1 },
            { url: img(203), order: 2 },
          ],
        },
      },
    })

    const l3 = await tx.listing.create({
      data: {
        sellerId: seller1.id,
        status: ListingStatus.SOLD,
        brand: 'Volkswagen',
        model: 'Golf',
        version: 'Comfortline 1.4 TSI',
        year: 2020,
        km: 67000,
        price: 18500,
        currency: Currency.USD,
        fuel: FuelType.NAFTA,
        transmission: Transmission.AUTOMATICO,
        color: 'Gris',
        doors: 5,
        description: 'Golf en excelente estado. Cuero, climatizador bizona.',
        city: 'Maldonado',
        department: 'Maldonado',
        images: {
          create: [
            { url: img(301), order: 0 },
            { url: img(302), order: 1 },
          ],
        },
      },
    })

    const l4 = await tx.listing.create({
      data: {
        sellerId: seller1.id,
        status: ListingStatus.ACTIVE,
        brand: 'Toyota',
        model: 'RAV4',
        version: '2.5 Hybrid AWD',
        year: 2023,
        km: 15000,
        price: 42000,
        currency: Currency.USD,
        fuel: FuelType.HIBRIDO,
        transmission: Transmission.AUTOMATICO,
        color: 'Negro',
        doors: 4,
        description: 'RAV4 Híbrido como nuevo. Garantía de fábrica vigente.',
        city: 'Maldonado',
        department: 'Maldonado',
        featured: true,
        acceptsTrade: true,
        hasFinancing: true,
        images: {
          create: [
            { url: img(401), order: 0 },
            { url: img(402), order: 1 },
            { url: img(403), order: 2 },
            { url: img(404), order: 3 },
          ],
        },
      },
    })

    const l5 = await tx.listing.create({
      data: {
        sellerId: seller1.id,
        status: ListingStatus.ACTIVE,
        brand: 'Nissan',
        model: 'Frontier',
        version: 'PRO-4X AT 4x4',
        year: 2021,
        km: 78000,
        price: 36000,
        currency: Currency.USD,
        fuel: FuelType.DIESEL,
        transmission: Transmission.AUTOMATICO,
        color: 'Blanco',
        doors: 4,
        description: 'Frontier doble cabina 4x4. Ideal campo y ciudad.',
        city: 'Maldonado',
        department: 'Maldonado',
        acceptsTrade: true,
        images: {
          create: [
            { url: img(501), order: 0 },
            { url: img(502), order: 1 },
            { url: img(503), order: 2 },
          ],
        },
      },
    })

    // --- seller2 (Car Center Montevideo) — 6 listings ---
    const l6 = await tx.listing.create({
      data: {
        sellerId: seller2.id,
        status: ListingStatus.ACTIVE,
        brand: 'Chevrolet',
        model: 'Cruze',
        version: 'LTZ 1.4 Turbo AT',
        year: 2022,
        km: 29000,
        price: 21000,
        currency: Currency.USD,
        fuel: FuelType.NAFTA,
        transmission: Transmission.AUTOMATICO,
        color: 'Rojo',
        doors: 4,
        description: 'Cruze LTZ equipado full. Cuero, cámara 360, sensores.',
        city: 'Montevideo',
        department: 'Montevideo',
        featured: true,
        hasFinancing: true,
        images: {
          create: [
            { url: img(601), order: 0 },
            { url: img(602), order: 1 },
            { url: img(603), order: 2 },
          ],
        },
      },
    })

    const l7 = await tx.listing.create({
      data: {
        sellerId: seller2.id,
        status: ListingStatus.ACTIVE,
        brand: 'Renault',
        model: 'Sandero',
        version: 'Stepway Zen 1.6',
        year: 2023,
        km: 18000,
        price: 11500,
        currency: Currency.USD,
        fuel: FuelType.NAFTA,
        transmission: Transmission.MANUAL,
        color: 'Naranja',
        doors: 5,
        description: 'Sandero Stepway seminuevo. Muy económico, ideal primer auto.',
        city: 'Montevideo',
        department: 'Montevideo',
        hasFinancing: true,
        images: {
          create: [
            { url: img(701), order: 0 },
            { url: img(702), order: 1 },
            { url: img(703), order: 2 },
          ],
        },
      },
    })

    const l8 = await tx.listing.create({
      data: {
        sellerId: seller2.id,
        status: ListingStatus.ACTIVE,
        brand: 'Ford',
        model: 'Ranger',
        version: 'XLS 2.2 TDCI MT 4x2',
        year: 2020,
        km: 95000,
        price: 26000,
        currency: Currency.USD,
        fuel: FuelType.DIESEL,
        transmission: Transmission.MANUAL,
        color: 'Gris',
        doors: 4,
        description: 'Ranger cabina doble. Muy cuidada, motor diesel.',
        city: 'Montevideo',
        department: 'Montevideo',
        acceptsTrade: true,
        images: {
          create: [
            { url: img(801), order: 0 },
            { url: img(802), order: 1 },
          ],
        },
      },
    })

    const l9 = await tx.listing.create({
      data: {
        sellerId: seller2.id,
        status: ListingStatus.PAUSED,
        brand: 'Volkswagen',
        model: 'Gol',
        version: 'Trend 1.6 MSI 5p',
        year: 2019,
        km: 110000,
        price: 9500,
        currency: Currency.USD,
        fuel: FuelType.NAFTA,
        transmission: Transmission.MANUAL,
        color: 'Azul',
        doors: 5,
        description: 'Gol Trend en buen estado. Ideal para trabajar.',
        city: 'Montevideo',
        department: 'Montevideo',
        images: {
          create: [
            { url: img(901), order: 0 },
            { url: img(902), order: 1 },
          ],
        },
      },
    })

    const l10 = await tx.listing.create({
      data: {
        sellerId: seller2.id,
        status: ListingStatus.ACTIVE,
        brand: 'Peugeot',
        model: '208',
        version: 'Allure 1.2 PureTech',
        year: 2022,
        km: 33000,
        price: 13000,
        currency: Currency.USD,
        fuel: FuelType.NAFTA,
        transmission: Transmission.MANUAL,
        color: 'Blanco Nácar',
        doors: 5,
        description: 'Peugeot 208 moderno, con pantalla i-Cockpit. Excelente estado.',
        city: 'Montevideo',
        department: 'Montevideo',
        images: {
          create: [
            { url: img(1001), order: 0 },
            { url: img(1002), order: 1 },
            { url: img(1003), order: 2 },
          ],
        },
      },
    })

    const l11 = await tx.listing.create({
      data: {
        sellerId: seller2.id,
        status: ListingStatus.FLAGGED,
        brand: 'Toyota',
        model: 'Hilux',
        version: 'SRX 4x4 AT',
        year: 2019,
        km: 130000,
        price: 34000,
        currency: Currency.USD,
        fuel: FuelType.DIESEL,
        transmission: Transmission.AUTOMATICO,
        color: 'Negro',
        doors: 4,
        description: 'Hilux SRX full equipo.',
        city: 'Montevideo',
        department: 'Montevideo',
        images: {
          create: [
            { url: img(1101), order: 0 },
            { url: img(1102), order: 1 },
          ],
        },
      },
    })

    // --- seller3 (AutoUruguay, Salto) — 4 listings ---
    const l12 = await tx.listing.create({
      data: {
        sellerId: seller3.id,
        status: ListingStatus.ACTIVE,
        brand: 'Renault',
        model: 'Clio',
        version: 'Intens 1.0 TCe MT',
        year: 2023,
        km: 22000,
        price: 10500,
        currency: Currency.USD,
        fuel: FuelType.NAFTA,
        transmission: Transmission.MANUAL,
        color: 'Rojo Fuego',
        doors: 5,
        description: 'Clio como nuevo. Pantalla multimedia, aire acondicionado.',
        city: 'Salto',
        department: 'Salto',
        images: {
          create: [
            { url: img(1201), order: 0 },
            { url: img(1202), order: 1 },
            { url: img(1203), order: 2 },
          ],
        },
      },
    })

    const l13 = await tx.listing.create({
      data: {
        sellerId: seller3.id,
        status: ListingStatus.ACTIVE,
        brand: 'Chevrolet',
        model: 'S10',
        version: 'High Country 4x4 AT',
        year: 2021,
        km: 65000,
        price: 38000,
        currency: Currency.USD,
        fuel: FuelType.DIESEL,
        transmission: Transmission.AUTOMATICO,
        color: 'Blanco',
        doors: 4,
        description: 'S10 High Country cuero, techo, pantalla 8". Ideal agro.',
        city: 'Salto',
        department: 'Salto',
        acceptsTrade: true,
        images: {
          create: [
            { url: img(1301), order: 0 },
            { url: img(1302), order: 1 },
            { url: img(1303), order: 2 },
          ],
        },
      },
    })

    const l14 = await tx.listing.create({
      data: {
        sellerId: seller3.id,
        status: ListingStatus.ACTIVE,
        brand: 'Ford',
        model: 'EcoSport',
        version: 'SE 1.5 TDCI MT',
        year: 2020,
        km: 82000,
        price: 14000,
        currency: Currency.USD,
        fuel: FuelType.DIESEL,
        transmission: Transmission.MANUAL,
        color: 'Gris',
        doors: 4,
        description: 'EcoSport diesel, economica y confiable. Buena para trayectos largos.',
        city: 'Rivera',
        department: 'Rivera',
        images: {
          create: [
            { url: img(1401), order: 0 },
            { url: img(1402), order: 1 },
          ],
        },
      },
    })

    const l15 = await tx.listing.create({
      data: {
        sellerId: seller3.id,
        status: ListingStatus.SOLD,
        brand: 'Nissan',
        model: 'Versa',
        version: 'Sense Plus CVT',
        year: 2022,
        km: 41000,
        price: 13500,
        currency: Currency.USD,
        fuel: FuelType.NAFTA,
        transmission: Transmission.AUTOMATICO,
        color: 'Plateado',
        doors: 4,
        description: 'Versa CVT. Vendido.',
        city: 'Salto',
        department: 'Salto',
        images: {
          create: [
            { url: img(1501), order: 0 },
            { url: img(1502), order: 1 },
          ],
        },
      },
    })

    // --- seller4 (particular, Canelones) — 2 listings ---
    const l16 = await tx.listing.create({
      data: {
        sellerId: seller4.id,
        status: ListingStatus.ACTIVE,
        brand: 'Volkswagen',
        model: 'Polo',
        version: 'Comfortline 1.6 MT',
        year: 2018,
        km: 88000,
        price: 11000,
        currency: Currency.USD,
        fuel: FuelType.GNC,
        transmission: Transmission.MANUAL,
        color: 'Blanco',
        doors: 5,
        description: 'Polo con GNC de fábrica. Ideal para taxímetro o uso particular. Todo en regla.',
        city: 'Canelones',
        department: 'Canelones',
        images: {
          create: [
            { url: img(1601), order: 0 },
            { url: img(1602), order: 1 },
            { url: img(1603), order: 2 },
          ],
        },
      },
    })

    const l17 = await tx.listing.create({
      data: {
        sellerId: seller4.id,
        status: ListingStatus.ACTIVE,
        brand: 'Chevrolet',
        model: 'Onix',
        version: 'Plus LTZ 1.0T AT',
        year: 2021,
        km: 55000,
        price: 15500,
        currency: Currency.USD,
        fuel: FuelType.NAFTA,
        transmission: Transmission.AUTOMATICO,
        color: 'Negro',
        doors: 4,
        description: 'Onix Plus LTZ, conectividad, pantalla 9". Un solo dueño.',
        city: 'Canelones',
        department: 'Canelones',
        images: {
          create: [
            { url: img(1701), order: 0 },
            { url: img(1702), order: 1 },
          ],
        },
      },
    })

    // --- seller5 (particular, Paysandú) — 1 listing ---
    const l18 = await tx.listing.create({
      data: {
        sellerId: seller5.id,
        status: ListingStatus.ACTIVE,
        brand: 'Peugeot',
        model: '3008',
        version: 'Allure Pack 1.6 THP AT',
        year: 2020,
        km: 72000,
        price: 19500,
        currency: Currency.USD,
        fuel: FuelType.NAFTA,
        transmission: Transmission.AUTOMATICO,
        color: 'Gris Platino',
        doors: 4,
        description: 'Peugeot 3008 SUV. Techo panorámico, i-Cockpit, asientos masajeadores.',
        city: 'Paysandú',
        department: 'Paysandú',
        acceptsTrade: true,
        images: {
          create: [
            { url: img(1801), order: 0 },
            { url: img(1802), order: 1 },
            { url: img(1803), order: 2 },
            { url: img(1804), order: 3 },
          ],
        },
      },
    })

    return [l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12, l13, l14, l15, l16, l17, l18]
  }, { timeout: 60000 })

  const totalImages = await db.listingImage.count()
  console.log(`✓ Created 18 listings`)
  console.log(`✓ Created ${totalImages} images`)

  // ------------------------------------------------------------------
  // 6. Create 5 leads
  // ------------------------------------------------------------------
  await db.$transaction([
    db.lead.create({
      data: {
        listingId: listings[0].id, // Corolla
        sellerId: seller1.id,
        buyerName: 'Andrés Pérez',
        buyerEmail: 'aperez@gmail.com',
        buyerPhone: '+598 99 123 456',
        message: 'Hola, ¿está disponible el Corolla? ¿Acepta permuta por Sandero 2020?',
        read: true,
      },
    }),
    db.lead.create({
      data: {
        listingId: listings[3].id, // RAV4
        sellerId: seller1.id,
        buyerName: 'Sofía Ibarra',
        buyerEmail: 'sibarra@outlook.com',
        buyerPhone: '+598 91 765 432',
        message: 'Me interesa el RAV4 híbrido, ¿cuál es el precio final con financiación?',
        read: false,
      },
    }),
    db.lead.create({
      data: {
        listingId: listings[5].id, // Cruze
        sellerId: seller2.id,
        buyerName: 'Rodrigo Núñez',
        buyerPhone: '+598 92 333 444',
        message: 'Quiero verlo este fin de semana, ¿cuándo puedo pasar?',
        read: false,
      },
    }),
    db.lead.create({
      data: {
        listingId: listings[9].id, // 208
        sellerId: seller2.id,
        buyerName: 'Valentina Castro',
        buyerEmail: 'vale.castro@gmail.com',
        buyerPhone: '+598 98 900 100',
        message: 'Estoy buscando un auto económico para ciudad. ¿Tiene garantía?',
        read: true,
      },
    }),
    db.lead.create({
      data: {
        listingId: listings[16].id, // Onix
        sellerId: seller4.id,
        buyerName: 'Facundo Reyes',
        buyerPhone: '+598 95 555 678',
        message: 'Me pasás el número de VIN para revisar historial?',
        read: false,
      },
    }),
  ])
  console.log('✓ Created 5 leads')

  // ------------------------------------------------------------------
  // 7. Create 3 featured boosts (2 active, 1 expired)
  // ------------------------------------------------------------------
  const now = new Date()
  const inFuture = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  const inPast = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

  await db.$transaction([
    db.featuredBoost.create({
      data: {
        listingId: listings[0].id, // Corolla — active
        sellerId: seller1.id,
        days: 7,
        status: BoostStatus.ACTIVE,
        startAt: now,
        endAt: inFuture(7),
      },
    }),
    db.featuredBoost.create({
      data: {
        listingId: listings[5].id, // Cruze — active
        sellerId: seller2.id,
        days: 14,
        status: BoostStatus.ACTIVE,
        startAt: now,
        endAt: inFuture(14),
      },
    }),
    db.featuredBoost.create({
      data: {
        listingId: listings[11].id, // Clio — expired
        sellerId: seller3.id,
        days: 7,
        status: BoostStatus.EXPIRED,
        startAt: inPast(10),
        endAt: inPast(3),
      },
    }),
  ])
  console.log('✓ Created 3 boosts')
  console.log('✓ Seed complete')
}

main()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
