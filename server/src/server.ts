import { config } from "dotenv";
config();

import express, {
  Application,
  Request,
  Response,
  NextFunction,
} from "express";

import cors from "cors";
import { corsOption } from "./v1/config";
import compression from "compression";
import cookieParser from "cookie-parser";
import figlet from "figlet";
//import next from "next";

import { credentials, authenticate }   from "./v1/middlewares";
import { authRoute, logoutRoute, refreshRoute, postRoute  } from "./v1/route";

const PORT = parseInt(process.env.PORT || "3500");

const dev = process.env.NODE_ENV !== "production";

// const nextApp = next({
//   dev,
//   hostname: "localhost",
//   port: PORT,
// });

// const handle = nextApp.getRequestHandler();

class App {
  public app: Application;
  

  constructor() {
    this.app = express();
    

    this.initializeMiddleware();
    this.initializeRoutes();
  }

  private initializeMiddleware = (): void => {
    this.app.use(
      (req: Request, res: Response, next: NextFunction) => {
        console.log(
          `Request URL: ${req.url} ${req.method} Method .....................................Request Time: ${new Date().toISOString()}`
        );

        next();
      }
    );

    this.app.use(
      compression({
        level: 8,
        threshold: 1024,
      })
    );

    this.app.use(credentials);

    this.app.use(cors(corsOption));

    this.app.use(cookieParser());

    this.app.use(
      express.urlencoded({
        extended: true,
        limit: "5mb",
      })
    );

    this.app.use(
      express.json({
        limit: "5mb",
      })
    );

  

    this.app.use(express.static("public"));
  };

  private initializeRoutes = (): void => {

    ////////////////////////////////
    // PUBLIC API routes
    ////////////////////////////////

    this.app.use("/auth", authRoute);

    this.app.use("/refresh", refreshRoute);

    this.app.use("/logout", logoutRoute);

    this.app.use("/post", postRoute);

    ////////////////////////////////
    // PROTECTED API routes
    ////////////////////////////////

    this.app.use("/api", authenticate);

    ////////////////////////////////////////////////
    // CATCH ALL ROUTE FOR NEXT.JS FRONTEND
    ////////////////////////////////////////////////

    // this.app.all("/{*splat}", (req: Request, res: Response) => {
    //   return handle(req, res);
    // });
  };

  public listen = async (port: number): Promise<void> => {

    //////////////////////////////////////////////////
    // PREPARE NEXT.JS FRONTEND
    //////////////////////////////////////////////////
    
    // await nextApp.prepare();

    this.app.listen(port, () => {
      figlet.text(
        "personal website V 1.0",
        {
          font: "Slant",
          horizontalLayout: "default",
          verticalLayout: "default",
        },
        function (err, data) {
          if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
          }

          console.log(data);
        }
      );

      console.log(`Server is running on port ${port}`);
      //console.log(`Frontend: http://localhost:${port}`);
      console.log(`API: http://localhost:${port}/api`);
    });
  };
}

const app = new App();

app.listen(PORT);

export default app;
