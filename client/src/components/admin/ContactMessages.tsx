import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';

const ContactMessages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const data = await apiClient.getContactMessages();
      return data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ messageId, status }: { messageId: string; status: string }) => {
      await apiClient.updateContactMessage(messageId, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      toast({
        title: "Status updated",
        description: "Message status has been updated successfully.",
      });
    },
  });

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message);
    // Mark as read if it's new
    if (message.status === 'new') {
      updateStatusMutation.mutate({ messageId: message.id, status: 'read' });
    }
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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
          <p className="text-gray-600">Manage customer inquiries and feedback</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="secondary">{messages?.length || 0} Total</Badge>
          <Badge variant="default">
            {messages?.filter((m: any) => m.status === 'new').length || 0} New
          </Badge>
        </div>
      </div>

      {!messages || messages.length === 0 ? (
        <Card className="p-8 text-center">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-600">Customer messages will appear here when they contact you.</p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message: any) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {message.message.substring(0, 50)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant={message.status === 'new' ? 'default' : 'secondary'}>
                      {message.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewMessage(message)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {message.status === 'new' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStatusMutation.mutate({ 
                            messageId: message.id, 
                            status: 'read' 
                          })}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {selectedMessage && (
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Message Details</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedMessage(null)}
            >
              Close
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Name</p>
              <p className="text-gray-900">{(selectedMessage as any).name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-gray-900">{(selectedMessage as any).email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Phone</p>
              <p className="text-gray-900">{(selectedMessage as any).phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Date</p>
              <p className="text-gray-900">
                {new Date((selectedMessage as any).createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Message</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">{(selectedMessage as any).message}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContactMessages;