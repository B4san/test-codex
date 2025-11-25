import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { Card } from '../utils/types';

interface CardItemProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (id: string) => void;
  onDragStart: (cardId: string) => void;
  onDragEnter: (cardId: string, index: number) => void;
  index: number;
}

export function CardItem({ card, onEdit, onDelete, onDragStart, onDragEnter, index }: CardItemProps) {
  return (
    <motion.article
      layout
      draggable
      onDragStart={() => onDragStart(card.id)}
      onDragEnter={() => onDragEnter(card.id, index)}
      className="card-glow group rounded-xl border border-white/10 bg-white/5 p-3 text-sm shadow-soft"
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-white">{card.title}</p>
          {card.description ? <p className="mt-1 text-xs text-white/70">{card.description}</p> : null}
        </div>
        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            aria-label="Editar tarjeta"
            onClick={() => onEdit(card)}
            className="rounded-lg bg-white/10 p-1 text-white/80 hover:bg-white/20"
          >
            <Pencil size={16} />
          </button>
          <button
            aria-label="Eliminar tarjeta"
            onClick={() => onDelete(card.id)}
            className="rounded-lg bg-white/10 p-1 text-white/80 hover:bg-white/20"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
