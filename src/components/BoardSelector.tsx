import { useState } from 'react';
import { Palette, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useBoardStore } from '../context/boardStore';
import { Board } from '../utils/types';

const colors = ['#7c3aed', '#0ea5e9', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6'];

export function BoardSelector() {
  const { boards, activeBoardId, setActiveBoard, addBoard, renameBoard, deleteBoard } = useBoardStore();
  const [name, setName] = useState('Nuevo tablero');
  const [color, setColor] = useState(colors[0]);

  const handleAdd = () => {
    if (!name.trim()) return;
    addBoard(name.trim(), color);
    setName('Nuevo tablero');
  };

  const handleRename = (board: Board, value: string) => {
    if (!value.trim()) return;
    renameBoard(board.id, value);
  };

  return (
    <div className="glass-panel rounded-2xl p-3 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Palette size={16} /> Tableros
        </div>
        {boards.length > 1 && activeBoardId ? (
          <button
            aria-label="Eliminar tablero"
            onClick={() => deleteBoard(activeBoardId)}
            className="rounded-lg bg-white/10 p-2 text-white/80 transition hover:bg-white/20"
          >
            <Trash2 size={16} />
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {boards.map((board) => (
          <button
            key={board.id}
            onClick={() => setActiveBoard(board.id)}
            className={`group flex flex-col rounded-xl border p-3 transition ${
              activeBoardId === board.id
                ? 'border-white/30 bg-white/10'
                : 'border-white/5 bg-white/5 hover:border-white/20'
            }`}
            style={{ borderColor: `${board.color}55`, boxShadow: activeBoardId === board.id ? `0 0 0 1px ${board.color}` : '' }}
          >
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: board.color }} />
              <input
                className="min-w-[140px] bg-transparent text-sm font-semibold text-white focus:outline-none"
                defaultValue={board.name}
                onBlur={(e) => handleRename(board, e.target.value)}
              />
            </div>
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          placeholder="Nombre del tablero"
        />
        <div className="flex gap-1">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`h-8 w-8 rounded-full border ${color === c ? 'ring-2 ring-white' : 'border-white/20'}`}
            />
          ))}
        </div>
        <Button size="sm" onClick={handleAdd}>
          <Plus size={16} className="mr-1" /> Crear
        </Button>
      </div>
    </div>
  );
}
