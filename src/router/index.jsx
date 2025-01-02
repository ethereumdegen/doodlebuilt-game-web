import { useRoutes } from "react-router-dom";
import MainLayout from "../layouts/Main";
 

import ContextLayout from "../layouts/Context";
import BlogLayout from "../layouts/Blog";
 
 
import Welcome from '../views/welcome/Main'
    
import Blog from '../views/blog/blog.md'   
import InventoryComp from '../views/blog/inventory-comp.md'    
import InventoryUi from '../views/blog/inventory-ui.md'   
import Abilities from '../views/blog/abilities.md'   

import TextureAtlas from '../views/blog/texture-atlas.md'    
 

import ErrorPage from "../views/error-page/Main";

  
    
function Router() {
  const routes = [


     {
      element: <ContextLayout />,
      children: [


        {
          path: "/",
          element: <MainLayout />,
          children:  [ 
              {
                path:"/",
                element: <Welcome />, 
              },

              

            ]
          
        },

      

        {
          
          element: <BlogLayout />,
          children: [
            {
              path: "/blog",
              element: <Blog />,
            },
          
            {
              path: "/blog/inventory-comp",
              element: <InventoryComp />,
            },

              {
              path: "/blog/inventory-ui",
              element: <InventoryUi />,
            },

              {
              path: "/blog/abilities",
              element: <Abilities />,
            },

            {
              path: "/blog/texture-atlas",
              element: <TextureAtlas />,
            },
         
        
          
          ],
        },

       
      
      
        {
          path: "/error-page",
          element: <ErrorPage />,
        },
        {
          path: "*",
          element: <ErrorPage />,
        },

    ] }
  ];

  return useRoutes(routes);
}

export default Router;
