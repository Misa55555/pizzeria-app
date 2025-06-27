// app/page.tsx

// 1. Importamos Prisma para acceder a la base de datos y Link para la navegación
import prisma from "@/lib/prisma";
import Link from "next/link";
// 2. Ya no importamos el servicio de prueba, sino el componente real
import { PizzaMenu } from "@/components/PizzaMenu";
import { ReservationModal } from "@/components/ReservationModal";

// 3. Convertimos la función en 'async' para poder usar 'await'
export default async function HomePage() {
  
  // 4. Reemplazamos el mock service por una llamada real a la base de datos
  const products = await prisma.product.findMany({
    where: {
      stock: {
        gt: 0, // Opcional: solo mostramos productos con stock > 0
      },
    },
    orderBy: {
      name: 'asc', // Ordenamos los productos alfabéticamente
    }
  });
  
  console.log("Productos obtenidos de la base de datos:", products);
  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
        <div className="container">
          <span className="navbar-brand h1 mb-0">🍕 Pizzería Deliciosa</span>
          <Link href="/login" className="btn btn-outline-light">
            Ingresar Admin
          </Link>
        </div>
      </nav>

      {/* Hero Section (sigue igual) */}
      <div className="bg-danger text-white py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Las Mejores Pizzas de la Ciudad</h1>
          <p className="lead mb-4">Ingredientes frescos, masa artesanal y el mejor sabor</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8">
            <h2 className="mb-4">Nuestro Menú</h2>
            {/* 5. Pasamos los productos reales de la DB al componente PizzaMenu */}
            <PizzaMenu products={products} />
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">¿Listo para ordenar?</h5>
                <p className="card-text">Selecciona tu pizza favorita y haz tu reserva</p>
                <button className="btn btn-danger btn-lg" data-bs-toggle="modal" data-bs-target="#reservationModal">
                  Reservar Ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* El ReservationModal sigue aquí, pero ahora también debería usar los 'products' reales */}
      <ReservationModal pizzas={products} />
    </div>
  );
}