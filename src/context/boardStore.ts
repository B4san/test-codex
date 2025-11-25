import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Board, Card, ID } from '../utils/types';
import { createId, reorderArray } from '../utils/helpers';

type MoveCardPayload = {
  cardId: ID;
  fromListId: ID;
  toListId: ID;
  toIndex: number;
};

type BoardStore = {
  boards: Board[];
  activeBoardId: ID;
  addBoard: (name: string, color: string) => void;
  renameBoard: (id: ID, name: string) => void;
  deleteBoard: (id: ID) => void;
  setActiveBoard: (id: ID) => void;
  addList: (boardId: ID, title: string) => void;
  renameList: (boardId: ID, listId: ID, title: string) => void;
  deleteList: (boardId: ID, listId: ID) => void;
  reorderLists: (boardId: ID, from: number, to: number) => void;
  addCard: (boardId: ID, listId: ID, card: Omit<Card, 'id'>) => void;
  updateCard: (boardId: ID, listId: ID, cardId: ID, payload: Partial<Card>) => void;
  deleteCard: (boardId: ID, listId: ID, cardId: ID) => void;
  moveCard: (boardId: ID, payload: MoveCardPayload) => void;
};

const demoBoards: Board[] = [
  {
    id: 'product',
    name: 'Producto',
    color: '#7c3aed',
    lists: [
      {
        id: createId(),
        title: 'Por hacer',
        cards: [
          { id: createId(), title: 'Redactar especificación', description: 'Definir alcance y entregables' },
          { id: createId(), title: 'Mapa de stakeholders', description: 'Identificar áreas clave' },
        ],
      },
      {
        id: createId(),
        title: 'En progreso',
        cards: [
          { id: createId(), title: 'Diseño UI', description: 'Explorar variantes del dashboard' },
        ],
      },
      {
        id: createId(),
        title: 'Hecho',
        cards: [
          { id: createId(), title: 'Kickoff con equipo', description: 'Notas compartidas en Notion' },
        ],
      },
    ],
  },
];

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, _get) => ({
      boards: demoBoards,
      activeBoardId: demoBoards[0].id,
      // Para conectar con una API real, reemplaza estas mutaciones por llamadas
      // asíncronas (GET/POST/PATCH/DELETE) y sincroniza el estado con la respuesta.
      addBoard: (name, color) =>
        set((state) => {
          const id = createId();
          return {
            boards: [...state.boards, { id, name, color, lists: [] }],
            activeBoardId: id,
          };
        }),
      renameBoard: (id, name) =>
        set((state) => ({
          boards: state.boards.map((board) => (board.id === id ? { ...board, name } : board)),
        })),
      deleteBoard: (id) =>
        set((state) => {
          const boards = state.boards.filter((board) => board.id !== id);
          const activeBoardId = state.activeBoardId === id && boards.length ? boards[0].id : boards[0]?.id ?? '';
          return { boards, activeBoardId };
        }),
      setActiveBoard: (id) => set({ activeBoardId: id }),
      addList: (boardId, title) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? { ...board, lists: [...board.lists, { id: createId(), title, cards: [] }] }
              : board
          ),
        })),
      renameList: (boardId, listId, title) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) => (list.id === listId ? { ...list, title } : list)),
                }
              : board
          ),
        })),
      deleteList: (boardId, listId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId ? { ...board, lists: board.lists.filter((list) => list.id !== listId) } : board
          ),
        })),
      reorderLists: (boardId, from, to) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? { ...board, lists: reorderArray(board.lists, from, to) }
              : board
          ),
        })),
      addCard: (boardId, listId, card) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId ? { ...list, cards: [...list.cards, { ...card, id: createId() }] } : list
                  ),
                }
              : board
          ),
        })),
      updateCard: (boardId, listId, cardId, payload) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          cards: list.cards.map((card) => (card.id === cardId ? { ...card, ...payload } : card)),
                        }
                      : list
                  ),
                }
              : board
          ),
        })),
      deleteCard: (boardId, listId, cardId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId ? { ...list, cards: list.cards.filter((card) => card.id !== cardId) } : list
                  ),
                }
              : board
          ),
        })),
      moveCard: (boardId, payload) =>
        set((state) => {
          const { cardId, fromListId, toListId, toIndex } = payload;
          const board = state.boards.find((b) => b.id === boardId);
          if (!board) return state;

          const sourceList = board.lists.find((l) => l.id === fromListId);
          const targetList = board.lists.find((l) => l.id === toListId);
          if (!sourceList || !targetList) return state;

          const card = sourceList.cards.find((c) => c.id === cardId);
          if (!card) return state;

          const newSourceCards = sourceList.cards.filter((c) => c.id !== cardId);
          const newTargetCards = [...targetList.cards];
          newTargetCards.splice(toIndex, 0, card);

          return {
            boards: state.boards.map((b) =>
              b.id === boardId
                ? {
                    ...b,
                    lists: b.lists.map((l) => {
                      if (l.id === sourceList.id) return { ...l, cards: newSourceCards };
                      if (l.id === targetList.id) return { ...l, cards: newTargetCards };
                      return l;
                    }),
                  }
                : b
            ),
          };
        }),
    }),
    {
      name: 'flowtrack-store',
    }
  )
);
