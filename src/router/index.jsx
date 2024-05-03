import { useRoutes } from "react-router-dom";
import MainLayout from "../layouts/Main";
 

import ContextLayout from "../layouts/Context";
import BlogLayout from "../layouts/Blog";
 
 
import Welcome from '../views/welcome/Main'
    
import Blog from '../views/blog/blog.md'   
import InventoryComp from '../views/blog/inventory-comp.md'    
 
 

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
