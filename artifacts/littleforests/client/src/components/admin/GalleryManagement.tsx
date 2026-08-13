import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, X, Check, Eye, EyeOff, ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';

type GalleryType = 'water-source' | 'green-champions';

interface GalleryItem {
  id: string;
  mediaUrl: string;
  media_url?: string;
  mediaType?: string;
  media_type?: string;
  caption?: string;
  springName?: string;
  spring_name?: string;
  schoolName?: string;
  school_name?: string;
  displayOrder?: number;
  display_order?: number;
  isActive?: boolean;
  is_active?: boolean;
}

// Normalize Supabase snake_case to camelCase
const normalize = (item: any): GalleryItem => ({
  id: item.id,
  mediaUrl: item.media_url ?? item.mediaUrl ?? '',
  mediaType: item.media_type ?? item.mediaType ?? 'photo',
  caption: item.caption ?? '',
  springName: item.spring_name ?? item.springName ?? '',
  schoolName: item.school_name ?? item.schoolName ?? '',
  displayOrder: item.display_order ?? item.displayOrder ?? 0,
  isActive: item.is_active ?? item.isActive ?? true,
});

const EMPTY_WATER = { mediaUrl: '', mediaType: 'photo', caption: '', springName: '', displayOrder: 0, isActive: true };
const EMPTY_CHAMP = { mediaUrl: '', caption: '', schoolName: '', displayOrder: 0, isActive: true };

interface Props {
  galleryType: GalleryType;
}

const GalleryManagement = ({ galleryType }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isWater = galleryType === 'water-source';
  const queryKey = ['admin-gallery', galleryType];
  const apiPath = `/gallery/${galleryType}`;
  const label = isWater ? 'Water Source Gallery' : 'Green Champions Gallery';
  const subLabel = isWater
    ? 'Photos and videos from water source protection sites.'
    : 'Photos from Green Champions school programmes.';

  const emptyForm = isWater ? { ...EMPTY_WATER } : { ...EMPTY_CHAMP };
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm);

  const { data: rawItems = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => (apiClient as any).getGalleryAll(galleryType) as Promise<GalleryItem[]>,
  });

  const items: GalleryItem[] = (rawItems as any[]).map(normalize);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ['gallery', galleryType] });
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => (apiClient as any).createGalleryItem(galleryType, data),
    onSuccess: () => { invalidate(); setShowForm(false); setForm(emptyForm); toast({ title: 'Photo added' }); },
    onError: () => toast({ title: 'Error', description: 'Failed to add item.', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => (apiClient as any).updateGalleryItem(galleryType, id, data),
    onSuccess: () => { invalidate(); setEditingId(null); setForm(emptyForm); toast({ title: 'Updated' }); },
    onError: () => toast({ title: 'Error', description: 'Failed to update.', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => (apiClient as any).deleteGalleryItem(galleryType, id),
    onSuccess: () => { invalidate(); toast({ title: 'Deleted' }); },
    onError: () => toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' }),
  });

  const toggleActive = (item: GalleryItem) =>
    updateMutation.mutate({ id: item.id, data: { is_active: !item.isActive } });

  const startEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setForm(isWater
      ? { mediaUrl: item.mediaUrl, mediaType: item.mediaType ?? 'photo', caption: item.caption ?? '', springName: item.springName ?? '', displayOrder: item.displayOrder ?? 0, isActive: item.isActive ?? true }
      : { mediaUrl: item.mediaUrl, caption: item.caption ?? '', schoolName: item.schoolName ?? '', displayOrder: item.displayOrder ?? 0, isActive: item.isActive ?? true }
    );
    setShowForm(false);
  };

  const cancelForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Map camelCase form to snake_case for API
    const payload = isWater
      ? { media_url: form.mediaUrl, media_type: form.mediaType, caption: form.caption, spring_name: form.springName, display_order: Number(form.displayOrder), is_active: form.isActive }
      : { media_url: form.mediaUrl, caption: form.caption, school_name: form.schoolName, display_order: Number(form.displayOrder), is_active: form.isActive };

    if (editingId) updateMutation.mutate({ id: editingId, data: payload });
    else createMutation.mutate(payload);
  };

  const FormPanel = () => (
    <Card className="p-6 border-green-200 bg-green-50">
      <h3 className="font-semibold text-green-800 mb-4">{editingId ? 'Edit Item' : 'Add New Photo/Video'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Image / Video URL *</Label>
          <Input
            value={form.mediaUrl}
            onChange={e => setForm((f: any) => ({ ...f, mediaUrl: e.target.value }))}
            required
            placeholder="https://... (paste a direct image or video URL)"
          />
          {form.mediaUrl && (
            <img src={form.mediaUrl} alt="preview" className="mt-2 h-24 w-auto rounded object-cover border" onError={e => (e.currentTarget.style.display = 'none')} />
          )}
        </div>

        {isWater && (
          <div>
            <Label>Media Type</Label>
            <select
              value={form.mediaType}
              onChange={e => setForm((f: any) => ({ ...f, mediaType: e.target.value }))}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="photo">Photo</option>
              <option value="video">Video</option>
            </select>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>{isWater ? 'Spring / Site Name (optional)' : 'School Name (optional)'}</Label>
            {isWater
              ? <Input value={form.springName} onChange={e => setForm((f: any) => ({ ...f, springName: e.target.value }))} placeholder="e.g. Kipkemoi Spring" />
              : <Input value={form.schoolName} onChange={e => setForm((f: any) => ({ ...f, schoolName: e.target.value }))} placeholder="e.g. Kaplong Secondary" />
            }
          </div>
          <div>
            <Label>Display Order</Label>
            <Input type="number" min={0} value={form.displayOrder} onChange={e => setForm((f: any) => ({ ...f, displayOrder: e.target.value }))} />
          </div>
        </div>

        <div>
          <Label>Caption (optional)</Label>
          <Input value={form.caption} onChange={e => setForm((f: any) => ({ ...f, caption: e.target.value }))} placeholder="Short description of the photo" />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={e => setForm((f: any) => ({ ...f, isActive: e.target.checked }))}
            className="rounded"
          />
          <Label htmlFor="isActive" className="cursor-pointer">Show on website</Label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-green-600 hover:bg-green-700">
            <Check className="h-4 w-4 mr-1" />
            {editingId ? 'Save Changes' : 'Add Photo'}
          </Button>
          <Button type="button" variant="outline" onClick={cancelForm}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        </div>
      </form>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{label}</h2>
          <p className="text-gray-600">{subLabel}</p>
        </div>
        {!showForm && !editingId && (
          <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" /> Add Photo
          </Button>
        )}
      </div>

      {(showForm && !editingId) && <FormPanel />}

      {isLoading && <p className="text-gray-500 text-center py-8">Loading gallery…</p>}

      {!isLoading && items.length === 0 && !showForm && (
        <Card className="p-8 text-center text-gray-500">
          <ImageIcon className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No photos yet</p>
          <p className="text-sm">Add your first photo to display in the {label.toLowerCase()}.</p>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className={`overflow-hidden ${!item.isActive ? 'opacity-50' : ''}`}>
            {editingId === item.id ? (
              <div className="p-4"><FormPanel /></div>
            ) : (
              <>
                <div className="relative aspect-video bg-gray-100">
                  {item.mediaUrl ? (
                    <img
                      src={item.mediaUrl}
                      alt={item.caption ?? ''}
                      className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-gray-300" />
                    </div>
                  )}
                  {!item.isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded">Hidden</span>
                    </div>
                  )}
                  {item.mediaType === 'video' && (
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">Video</span>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {(item.springName || item.schoolName) && (
                        <p className="text-xs font-semibold text-green-700 truncate">{item.springName || item.schoolName}</p>
                      )}
                      {item.caption && <p className="text-xs text-gray-500 truncate">{item.caption}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">Order: {item.displayOrder ?? 0}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" variant="ghost" title={item.isActive ? 'Hide' : 'Show'} onClick={() => toggleActive(item)}>
                        {item.isActive ? <Eye className="h-3.5 w-3.5 text-green-600" /> : <EyeOff className="h-3.5 w-3.5 text-gray-400" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => startEdit(item)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50"
                        onClick={() => { if (confirm('Delete this photo?')) deleteMutation.mutate(item.id); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GalleryManagement;
