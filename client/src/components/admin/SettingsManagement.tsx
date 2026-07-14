import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Save, Phone, MapPin, Info } from 'lucide-react';

const SETTINGS_FIELDS = [
  {
    key: 'whatsapp_number',
    label: 'WhatsApp Number',
    description: 'Full number with country code, e.g. 2540143538080',
    icon: <Phone className="h-4 w-4" />,
    placeholder: '2540143538080',
  },
  {
    key: 'whatsapp_display',
    label: 'WhatsApp Display Text',
    description: 'How the number appears on the site, e.g. +254 143 538 080',
    icon: <Phone className="h-4 w-4" />,
    placeholder: '+254 143 538 080',
  },
  {
    key: 'location',
    label: 'Business Location',
    description: 'Your physical location shown on the site',
    icon: <MapPin className="h-4 w-4" />,
    placeholder: 'Bomet County, Kenya',
  },
  {
    key: 'maps_url',
    label: 'Google Maps Link',
    description: 'The Google Maps share URL for your nursery pin',
    icon: <MapPin className="h-4 w-4" />,
    placeholder: 'https://maps.app.goo.gl/...',
  },
];

const SettingsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const { data: settingsContent = [], isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => apiClient.getContent('settings'),
  });

  // Populate local state from fetched settings
  useEffect(() => {
    if (Array.isArray(settingsContent)) {
      const map: Record<string, string> = {};
      settingsContent.forEach((item: any) => {
        map[item.title] = item.content;
      });
      setValues(map);
    }
  }, [settingsContent]);

  const saveMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const existing = Array.isArray(settingsContent)
        ? (settingsContent as any[]).find((item: any) => item.title === key)
        : null;

      if (existing) {
        return apiClient.updateContent(existing.id, { title: key, content: value, type: 'settings' });
      } else {
        return apiClient.createContent({ title: key, content: value, type: 'settings', status: 'published' });
      }
    },
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      setSaving(null);
      toast({ title: 'Setting saved', description: 'Your change has been saved.' });
    },
    onError: () => {
      setSaving(null);
      toast({ title: 'Error', description: 'Failed to save setting.', variant: 'destructive' });
    },
  });

  const handleSave = (key: string) => {
    setSaving(key);
    saveMutation.mutate({ key, value: values[key] || '' });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">Loading settings...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
        <p className="text-gray-600">Update contact details and other site-wide information.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          Changes here update the database. The website footer and contact page will reflect
          these values once you also update the hardcoded references in code — or ask your developer to wire these up dynamically.
        </p>
      </div>

      <div className="grid gap-6">
        {SETTINGS_FIELDS.map((field) => (
          <Card key={field.key} className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-600">{field.icon}</span>
              <Label className="text-base font-semibold">{field.label}</Label>
            </div>
            <p className="text-sm text-gray-500 mb-3">{field.description}</p>
            <div className="flex gap-3">
              <Input
                value={values[field.key] || ''}
                onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="flex-1"
              />
              <Button
                onClick={() => handleSave(field.key)}
                disabled={saving === field.key}
                className="bg-green-600 hover:bg-green-700 shrink-0"
              >
                <Save className="h-4 w-4 mr-1" />
                {saving === field.key ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SettingsManagement;
