import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

// understand the structure of a project is very important! It is a contract and we should develop by following the contract
//-------------Peiyi comment-----------
// all about routes - route here means LAYOUT route
// this file is main "directory" shows in this UI app "directory"/"layout", if the app needs multiple pages(consider as its subfiles/subroutes), you can list in the <link>
// all files/pages starts with app.*, will be its(app) subroutes, which fall into this app "directory"
// to visit this directory, use app/* e.g app.additional.jsx, if visit, it is https://.../app/additional e.g app.tada.jsx, go to ttps://.../app/tada
// if just app/, then it use the default page  app._index.jsx
// all files start with app* will go thru app route <Outlet /> below.
// All exmples I use is about a url. But the route is a layout route, so it can be a url, also can be a section/segment of a page
//-----------Peiyi comment end---------

//-------------Peiyi comment-----------
// each jsx file under /routes directory could be a route/url. e.g xx.jsx https://.../xxx
// if you create a file name test.jsx. Based on the naming, it is not app route. it has its own route. https://.../test
// it can have sub route too! if it need sub route then put <Outlet />  int test.jsx. then same rule that all files like test.* are its subroutes and use its <Outlet />
//-----------Peiyi comment end---------
export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ui-nav-menu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/additional">Additional page</Link>
      </ui-nav-menu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
