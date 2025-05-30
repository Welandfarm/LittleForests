
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ContactMessages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      toast({
        title: "Status updated",
        description: "Message status has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading messages...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Messages</h2>
      </div>

      <Card>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages?.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.phone || 'N/A'}</TableCell>
                  <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                  <TableCell>
                    <Badge variant={
                      message.status === 'new' ? 'destructive' :
                      message.status === 'read' ? 'default' : 'secondary'
                    }>
                      {message.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {message.status === 'new' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(message.id, 'read')}
                        >
                          Mark Read
                        </Button>
                      )}
                      {message.status === 'read' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(message.id, 'responded')}
                        >
                          Mark Responded
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ContactMessages;
