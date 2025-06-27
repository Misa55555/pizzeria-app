// components/DeleteButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteButtonProps {
  productId: string;
}

export default function DeleteButton({ productId }: DeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer."
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      // Si la respuesta NO fue exitosa (ej. 409 Conflict)
      if (!response.ok) {
        // Leemos el mensaje de error que nos envió la API
        const errorText = await response.text();
        // Lanzamos un error con ese mensaje específico
        throw new Error(errorText || "Error al eliminar el producto");
      }

      // Si todo fue bien, refrescamos la página
      router.refresh();
      
    } catch (error: any) {
      console.error(error);
      // Mostramos el mensaje de error específico en la alerta
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      className="btn btn-sm btn-outline-danger"
      disabled={isLoading}
    >
      {isLoading ? "..." : "Eliminar"}
    </button>
  );
}
