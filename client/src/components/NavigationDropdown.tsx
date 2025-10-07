import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

const NavigationDropdown = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Prefetch data on hover to improve perceived performance
  const handlePrefetch = (page: string) => {
    if (page === '/') {
      queryClient.prefetchQuery({
        queryKey: ['products'],
        queryFn: () => apiClient.getProducts(),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      });
      queryClient.prefetchQuery({
        queryKey: ['content'],
        queryFn: () => apiClient.getContent(),
        staleTime: 5 * 60 * 1000,
      });
    } else if (page === '/green-towns') {
      queryClient.prefetchQuery({
        queryKey: ['greentowns-content'],
        queryFn: async () => {
          const data = await apiClient.getContent();
          const contentObj: { [key: string]: { title: string; content: string; type: string } } = {};
          if (Array.isArray(data)) {
            data.forEach((item: any) => {
              const key = item.title?.toLowerCase().replace(/\s+/g, '_') || '';
              contentObj[key] = { title: item.title || '', content: item.content || '', type: item.type || 'page' };
            });
          }
          return contentObj;
        },
        staleTime: 5 * 60 * 1000,
      });
    }
  };

  const handleNavigation = (path: string) => {
    // Navigate to the path - this will work even if already on the page
    navigate(path);
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-green-600 text-white hover:bg-green-700">
            Menu
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[200px]">
              <li>
                <NavigationMenuLink asChild>
                  <button
                    onMouseEnter={() => handlePrefetch('/')}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/');
                    }}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                  >
                    <div className="text-sm font-medium leading-none">Shop with us</div>
                  </button>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/about');
                    }}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                  >
                    <div className="text-sm font-medium leading-none">About Us</div>
                  </button>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <button
                    onMouseEnter={() => handlePrefetch('/green-towns')}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/green-towns');
                    }}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                  >
                    <div className="text-sm font-medium leading-none">Green Towns Initiative</div>
                  </button>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationDropdown;