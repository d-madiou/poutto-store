"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import {
  createCategory,
  renameCategory,
  deleteCategory,
} from "@/actions/categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Category = { id: string; name: string; _count: { products: number } };

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [isPending, startTransition] = useTransition();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    startTransition(async () => {
      const result = await createCategory(newName);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Catégorie créée");
      setNewName("");
    });
  }

  function startEditing(category: Category) {
    setEditingId(category.id);
    setEditValue(category.name);
  }

  function handleRename(id: string) {
    if (!editValue.trim()) return;
    startTransition(async () => {
      const result = await renameCategory(id, editValue);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Catégorie modifiée");
      setEditingId(null);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Catégorie supprimée");
    });
  }

  return (
    <div>
      <form onSubmit={handleCreate} className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nouvelle catégorie"
          className="h-11"
        />
        <Button type="submit" disabled={isPending} className="h-11 shrink-0">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </form>

      <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center gap-3 p-3">
            {editingId === category.id ? (
              <>
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-10 flex-1"
                  autoFocus
                />
                <button
                  type="button"
                  aria-label="Valider"
                  onClick={() => handleRename(category.id)}
                  disabled={isPending}
                  className="flex h-10 w-10 items-center justify-center rounded-md text-primary hover:bg-secondary"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Annuler"
                  onClick={() => setEditingId(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {category.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {category._count.products} produit
                    {category._count.products > 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Modifier"
                  onClick={() => startEditing(category)}
                  className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Supprimer"
                  onClick={() => handleDelete(category.id)}
                  disabled={isPending}
                  className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}