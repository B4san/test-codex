import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { Card, List } from '../utils/types';
import { Button } from './ui/button';
import { CardItem } from './CardItem';

interface ColumnProps {
  list: List;
  onAddCard: (title: string) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (cardId: string) => void;
  onRenameList: (title: string) => void;
  onDeleteList: () => void;
  onDragCardStart: (cardId: string, listId: string) => void;
  onCardEnter: (listId: string, cardId: string, index: number) => void;
  onDropToList: (listId: string, index?: number) => void;
  draggableProps: {
    onDragStart: (e: React.DragEvent) => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragEnd: () => void;
  };
}

export function Column({
  list,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onRenameList,
  onDeleteList,
  onDragCardStart,
  onCardEnter,
  onDropToList,
  draggableProps,
}: ColumnProps) {
  const [newCard, setNewCard] = useState('');
  const [editingTitle, setEditingTitle] = useState(list.title);
  const hasCards = useMemo(() => list.cards.length > 0, [list.cards.length]);

  const handleSubmit = () => {
    if (!newCard.trim()) return;
    onAddCard(newCard.trim());
    setNewCard('');
  };

  return (
    <motion.section
      layout
      draggable
      onDragStart={(e) => draggableProps.onDragStart(e)}
      onDragEnter={(e) => draggableProps.onDragEnter(e)}
      onDragEnd={draggableProps.onDragEnd}
      className="min-w-[280px] max-w-[320px] rounded-2xl border border-white/10 bg-white/5 p-3 shadow-soft"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <input
          value={editingTitle}
          onChange={(e) => setEditingTitle(e.target.value)}
          onBlur={() => editingTitle.trim() && onRenameList(editingTitle)}
          className="w-full rounded-lg bg-transparent px-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <button
          onClick={onDeleteList}
          className="rounded-lg bg-white/10 p-2 text-white/70 transition hover:bg-white/20"
          aria-label="Eliminar lista"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div
        className="space-y-2"
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => onDropToList(list.id, list.cards.length)}
      >
        <AnimatePresence>
          {list.cards.map((card, index) => (
            <motion.div key={card.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <CardItem
                card={card}
                index={index}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
                onDragStart={(cardId) => onDragCardStart(cardId, list.id)}
                onDragEnter={(cardId) => onCardEnter(list.id, cardId, index)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {!hasCards ? (
          <div
            className="rounded-xl border border-dashed border-white/10 p-3 text-center text-xs text-white/50"
            onDrop={() => onDropToList(list.id, 0)}
          >
            Arrastra tarjetas aquí
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={newCard}
          onChange={(e) => setNewCard(e.target.value)}
          placeholder="Nueva tarjeta"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <Button size="sm" variant="secondary" onClick={handleSubmit}>
          <Plus size={16} />
        </Button>
      </div>
    </motion.section>
  );
}
