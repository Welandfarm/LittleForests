import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Star, X, Check } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  project?: string;
  rating?: number;
}

const EMPTY_FORM = { name: '', location: '', text: '', project: '', rating: 5 };

const StarPicker = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button key={n} type="button" onClick={() => onChange(n)}>
        <Star
          className={`h-5 w-5 ${n <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      </button>
    ))}
  </div>
);

const StarDisplay = ({ rating }: { rating?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`h-4 w-4 ${n <= (rating ?? 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
      />
    ))}
  </div>
);

const TestimonialsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => apiClient.getTestimonials() as Promise<Testimonial[]>,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof EMPTY_FORM) => apiClient.createTestimonial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setShowForm(false);
      setForm(EMPTY_FORM);
      toast({ title: 'Testimonial added' });
    },
    onError: () => toast({ title: 'Error', description: 'Failed to add testimonial.', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof EMPTY_FORM }) =>
      apiClient.updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setEditingId(null);
      setForm(EMPTY_FORM);
      toast({ title: 'Testimonial updated' });
    },
    onError: () => toast({ title: 'Error', description: 'Failed to update testimonial.', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast({ title: 'Testimonial deleted' });
    },
    onError: () => toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' }),
  });

  const startEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({ name: t.name, location: t.location, text: t.text, project: t.project ?? '', rating: t.rating ?? 5 });
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const FormPanel = () => (
    <Card className="p-6 border-green-200 bg-green-50">
      <h3 className="font-semibold text-green-800 mb-4">{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Customer Name *</Label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. Jane Wanjiku" />
          </div>
          <div>
            <Label>Location *</Label>
            <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required placeholder="e.g. Nairobi, Kenya" />
          </div>
        </div>
        <div>
          <Label>Testimonial *</Label>
          <Textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} required rows={3} placeholder="What did the customer say?" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Project (optional)</Label>
            <Input value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} placeholder="e.g. Green Towns Initiative" />
          </div>
          <div>
            <Label>Rating</Label>
            <div className="mt-2">
              <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
            </div>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-green-600 hover:bg-green-700">
            <Check className="h-4 w-4 mr-1" />
            {editingId ? 'Save Changes' : 'Add Testimonial'}
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
          <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
          <p className="text-gray-600">Manage customer reviews shown on the homepage.</p>
        </div>
        {!showForm && !editingId && (
          <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" /> Add Testimonial
          </Button>
        )}
      </div>

      {(showForm && !editingId) && <FormPanel />}

      {isLoading && <p className="text-gray-500 text-center py-8">Loading testimonials…</p>}

      {!isLoading && (testimonials as Testimonial[]).length === 0 && !showForm && (
        <Card className="p-8 text-center text-gray-500">
          <Star className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No testimonials yet</p>
          <p className="text-sm">Add your first customer review to display on the homepage.</p>
        </Card>
      )}

      <div className="grid gap-4">
        {(testimonials as Testimonial[]).map((t) => (
          <Card key={t.id} className="p-5">
            {editingId === t.id ? (
              <FormPanel />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-900">{t.name}</span>
                    <span className="text-sm text-gray-500">{t.location}</span>
                    {t.project && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{t.project}</span>}
                  </div>
                  <StarDisplay rating={t.rating} />
                  <p className="text-gray-700 mt-2 text-sm leading-relaxed">"{t.text}"</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => startEdit(t)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => { if (confirm('Delete this testimonial?')) deleteMutation.mutate(t.id); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsManagement;
