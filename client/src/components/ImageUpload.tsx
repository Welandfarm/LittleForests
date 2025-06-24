
import React, { useState } from 'react';
// Image upload functionality disabled for demo
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, currentImageUrl, className = "" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const { toast } = useToast();

  // Update preview when currentImageUrl changes
  React.useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // For demo purposes, create a local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setPreview(imageUrl);
        onImageUploaded(imageUrl);
      };
      reader.readAsDataURL(file);

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUploaded('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              className="relative overflow-hidden"
            >
              <input
                type="file"
                accept="image/*"
                onChange={uploadImage}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {uploading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Choose Image</span>
                </div>
              )}
            </Button>
            {preview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeImage}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {preview && (
        <div className="mt-4">
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={removeImage}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {!preview && (
        <div className="mt-4 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No image selected</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
