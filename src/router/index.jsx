import { useRoutes } from "react-router-dom";
import MainLayout from "../layouts/Main";
 

import ContextLayout from "../layouts/Context";
import BlogLayout from "../layouts/Blog";
 
 
import Welcome from '../views/welcome/Main'
    
import Blog from '../views/blog/blog.md'   
import Vibegraph from '../views/blog/vibegraph.md'   
import DegenSql from '../views/blog/degen-sql.md'   
 

import WebappDevops from '../views/blog/webapp-devops.md'

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
              path: "/blog/vibegraph",
              element: <Vibegraph />,
            },

            {
              path: "/blog/webapp-devops",
              element: <WebappDevops />,
            },

            {
              path: "/blog/degen-sql",
              element: <DegenSql />,
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
