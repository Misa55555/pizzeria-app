// app/api/products/[id]/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// La función PATCH para actualizar está bien, la mantenemos como está.
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const id = params.id;
  const body = await request.json(); 

  if (body.stock !== undefined && body.stock < 0) {
    return new NextResponse("El stock no puede ser un número negativo", { status: 400 });
  }

  try {
    const { id: productId, category, ...updateData } = body;
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: updateData, 
    });
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

// =======================================================
// ESTA ES LA FUNCIÓN CORREGIDA
// =======================================================
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 1. Seguridad: Siempre verificamos la sesión y el rol primero
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const id = params.id;

  try {
    // 2. ANTES de borrar, verificamos si el producto está en algún pedido
    const orderItemsCount = await prisma.orderItem.count({
      where: {
        productId: id,
      },
    });

    // 3. Si el contador es mayor que 0, el producto ha sido pedido. Devolvemos un error.
    if (orderItemsCount > 0) {
      return new NextResponse(
        "No se puede eliminar un producto que ya forma parte de un pedido.",
        { status: 409 } // 409 Conflict es un buen código para esta situación
      );
    }

    // 4. Si el contador es 0, procedemos a eliminar el producto.
    await prisma.product.delete({
      where: { id: id },
    });

    // Enviamos una confirmación de éxito.
    return NextResponse.json({ message: "Producto eliminado" }, { status: 200 });

  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
