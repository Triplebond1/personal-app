import { config } from "dotenv";
config();

import express, {
  Application,
  Request,
  Response,
  NextFunction,
} from "express";

import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import figlet from "figlet";
import next from "next";

import { credentials, Auth } from "./v1/middlewares";
import { authRoute, logoutRoute, refreshRoute } from "./v1/route";

const PORT = parseInt(process.env.PORT || "3500");

const dev = process.env.NODE_ENV !== "production";

const nextApp = next({
  dev,
  hostname: "localhost",
  port: PORT,
});

const handle = nextApp.getRequestHandler();

class App {
  public app: Application;
  private auth: Auth;

  constructor() {
    this.app = express();
    this.auth = new Auth();

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

    this.app.use(cors());

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
    /*
     * Public authentication routes
     */
    this.app.use("/auth", authRoute);

    this.app.use("/refresh", refreshRoute);

    this.app.use("/logout", logoutRoute);

    /*
     * Protected API routes
     *
     * Add protected API routes below this middleware.
     */
    this.app.use("/api", this.auth.verifyJwt);

    /*
     * Example protected route
     */
    this.app.get(
      "/api/health",
      (req: Request, res: Response) => {
        res.status(200).json({
          status: "success",
          message: "Personal website API is running",
        });
      }
    );

    /*
     * Next.js frontend
     *
     * Everything that wasn't handled by Express
     * is passed to Next.js.
     */
    this.app.all("/{*splat}", (req: Request, res: Response) => {
      return handle(req, res);
    });
  };

  public listen = async (port: number): Promise<void> => {
    /*
     * Prepare Next.js before starting Express.
     */
    await nextApp.prepare();

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
      console.log(`Frontend: http://localhost:${port}`);
      console.log(`API: http://localhost:${port}/api`);
    });
  };
}

const app = new App();

app.listen(PORT);

export default app;
