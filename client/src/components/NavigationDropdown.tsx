
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
        <Button variant="outline" size="lg" className="flex items-center gap-3 px-6 py-3 text-lg">
          <Menu className="h-6 w-6" />
          <span>Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-white border shadow-lg">
        <DropdownMenuItem 
          onClick={() => navigate('/')}
          className="cursor-pointer hover:bg-green-50 py-3 px-4 text-base"
        >
          Shop with us
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/about')}
          className="cursor-pointer hover:bg-green-50 py-3 px-4 text-base"
        >
          About us
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/green-towns')}
          className="cursor-pointer hover:bg-green-50 py-3 px-4 text-base"
        >
          Green Towns Initiative
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavigationDropdown;
