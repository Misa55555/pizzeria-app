"use client"

import type { Pizza as Game } from "@/types" // Renombramos 'Pizza' a 'Game' para claridad
import Image from "next/image"

// Definimos las props para el nuevo componente de lista de juegos
interface GameListProps {
  games: Game[]
  onEdit: (game: Game) => void
  onDelete: (id: string) => void
}

// Este es el nuevo componente con el diseño para la tienda de juegos de mesa
export function GameList({ games, onEdit, onDelete }: GameListProps) {
  // Estado para cuando no hay juegos, con un diseño más moderno
  if (games.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-zinc-800/50 rounded-2xl border-2 border-dashed border-zinc-700 mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-zinc-600 mb-4"><path d="m14.5 2-3.5 3.5 4 4L18.5 6l-4-4Z"/><path d="m12 12 4 4"/><path d="M10 10v4.5l4 4"/><path d="M14 14h4.5l4-4"/><path d="m3.5 3.5 4 4L4 11l-4-4 3.5-3.5Z"/><path d="M4 12v4.5l4 4"/><path d="M8.5 10H4l-4 4"/></svg>
        <h3 className="text-2xl font-bold text-gray-200">El estante está vacío</h3>
        <p className="text-gray-500 mt-2">Agrega nuevos juegos de mesa para que aparezcan aquí.</p>
      </div>
    )
  }

  // Cuadrícula responsive para mostrar los juegos
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-8">
      {games.map((game) => (
        <div 
          key={game.id} 
          className="group bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden flex flex-col shadow-lg hover:shadow-amber-500/20 hover:-translate-y-2 transition-all duration-300"
        >
          {/* Contenedor de la imagen del juego */}
          <div className="relative w-full h-56">
            <Image
              src={game.image || "https://placehold.co/400x300/18181b/f59e0b?text=Juego"}
              alt={game.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Contenido de la tarjeta del juego */}
          <div className="p-5 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-gray-100 truncate">{game.name}</h3>
            <p className="text-gray-400 text-sm mt-1 flex-grow min-h-[60px]">{game.description}</p>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-2xl font-black text-amber-400">${game.price.toFixed(2)}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                game.available 
                ? "bg-green-500/20 text-green-300" 
                : "bg-red-500/20 text-red-300"
              }`}>
                {game.available ? "Disponible" : "Agotado"}
              </span>
            </div>
          </div>
          
          {/* Botones de acción con nuevo estilo */}
          <div className="border-t border-zinc-700 bg-zinc-800/50 p-3 flex gap-3">
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2" 
              onClick={() => onEdit(game)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              Editar
            </button>
            <button 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2" 
              onClick={() => onDelete(game.id)}
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
