
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const NavigationDropdown = () => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Menu className="h-4 w-4" />
          <span className="hidden sm:inline">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 bg-white border shadow-lg">
        <DropdownMenuItem 
          onClick={() => navigate('/')}
          className="cursor-pointer hover:bg-green-50"
        >
          Shop with us
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/about')}
          className="cursor-pointer hover:bg-green-50"
        >
          About us
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavigationDropdown;
