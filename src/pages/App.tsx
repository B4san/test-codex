import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, Menu, Moon, Plus, SunMedium } from 'lucide-react';
import { BoardSelector } from '../components/BoardSelector';
import { Column } from '../components/Column';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../components/ui/dialog';
import { useBoardStore } from '../context/boardStore';
import { Card } from '../utils/types';

export default function App() {
  const {
    boards,
    activeBoardId,
    addList,
    renameList,
    deleteList,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    reorderLists,
  } = useBoardStore();
  const board = useMemo(() => boards.find((b) => b.id === activeBoardId), [boards, activeBoardId]);

  const [draggedCard, setDraggedCard] = useState<{ id: string; fromListId: string } | null>(null);
  const [draggedList, setDraggedList] = useState<{ id: string; index: number } | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('Nueva lista');
  const [dark, setDark] = useState(true);

  const handleDropCard = (targetListId: string, index = 0) => {
    if (!board || !draggedCard) return;
    moveCard(board.id, {
      cardId: draggedCard.id,
      fromListId: draggedCard.fromListId,
      toListId: targetListId,
      toIndex: index,
    });
    setDraggedCard(null);
  };

  const handleReorderLists = (overId: string) => {
    if (!board || !draggedList) return;
    const overIndex = board.lists.findIndex((l) => l.id === overId);
    if (overIndex === -1 || overIndex === draggedList.index) return;
    reorderLists(board.id, draggedList.index, overIndex);
  };

  const gradient = board ? `linear-gradient(120deg, ${board.color}55, transparent)` : 'transparent';

  return (
    <div className={`board-gradient min-h-screen pb-10 ${dark ? '' : 'invert'}`}>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">FlowTrack</p>
            <h1 className="text-3xl font-bold text-white">Tablero visual</h1>
            <p className="text-sm text-white/60">Diseñado para mover tareas con suavidad.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setDark((d) => !d)}>
              {dark ? <SunMedium size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />} Tema
            </Button>
          </div>
        </header>

        <BoardSelector />

        <div className="glass-panel relative overflow-hidden rounded-3xl border border-white/10 p-5 shadow-soft">
          <div
            className="absolute inset-0 opacity-60"
            style={{ background: gradient }}
            aria-hidden
          />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Menu size={16} /> Listas
            </div>
            {board ? (
              <div className="flex items-center gap-2">
                <input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Nueva lista"
                />
                <Button
                  variant="default"
                  onClick={() => {
                    if (newListName.trim()) {
                      addList(board.id, newListName.trim());
                      setNewListName('Nueva lista');
                    }
                  }}
                >
                  <Plus size={16} className="mr-2" /> Lista
                </Button>
              </div>
            ) : null}
          </div>

          {board ? (
            <div className="mt-5 flex items-start gap-4 overflow-x-auto pb-4">
              <AnimatePresence initial={false}>
                {board.lists.map((list, index) => (
                  <Column
                    key={list.id}
                    list={list}
                    onAddCard={(title) => addCard(board.id, list.id, { title })}
                    onEditCard={(card) => {
                      setEditingListId(list.id);
                      setEditingCard(card);
                    }}
                    onDeleteCard={(cardId) => deleteCard(board.id, list.id, cardId)}
                    onRenameList={(title) => renameList(board.id, list.id, title)}
                    onDeleteList={() => deleteList(board.id, list.id)}
                    onDragCardStart={(cardId) => setDraggedCard({ id: cardId, fromListId: list.id })}
                    onCardEnter={(_, cardId, position) => handleDropCard(list.id, position)}
                    onDropToList={(listId, position) => handleDropCard(listId, position ?? 0)}
                    draggableProps={{
                      onDragStart: () => setDraggedList({ id: list.id, index }),
                      onDragEnter: () => handleReorderLists(list.id),
                      onDragEnd: () => setDraggedList(null),
                    }}
                  />
                ))}
              </AnimatePresence>
              <motion.div
                className="flex min-w-[240px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/60"
                whileHover={{ scale: 1.02 }}
              >
                Agrega listas para organizar tu sprint
              </motion.div>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-white/15 p-6 text-center text-white/60">
              Crea tu primer tablero para comenzar
            </div>
          )}
        </div>
      </div>

      <Dialog open={Boolean(editingCard)} onOpenChange={(open) => !open && setEditingCard(null)}>
        <DialogContent>
          <DialogHeader title="Editar tarjeta" description="Ajusta título y descripción" />
          <div className="space-y-3">
            <input
              value={editingCard?.title ?? ''}
              onChange={(e) => setEditingCard((card) => (card ? { ...card, title: e.target.value } : card))}
              className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Título"
            />
            <textarea
              value={editingCard?.description ?? ''}
              onChange={(e) => setEditingCard((card) => (card ? { ...card, description: e.target.value } : card))}
              rows={4}
              className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Descripción"
            />
            <div className="flex justify-end gap-2">
              <DialogTrigger asChild>
                <Button variant="ghost">Cerrar</Button>
              </DialogTrigger>
              <Button
                onClick={() => {
                  if (!board || !editingListId || !editingCard) return;
                  updateCard(board.id, editingListId, editingCard.id, {
                    title: editingCard.title,
                    description: editingCard.description,
                  });
                  setEditingCard(null);
                }}
              >
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
