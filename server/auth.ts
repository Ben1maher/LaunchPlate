import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, InsertUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Generate a strong random session secret
  const sessionSecret = process.env.SESSION_SECRET || randomBytes(32).toString("hex");
  
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
    },
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username", // Could also be email
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          // Check if username matches username or email
          const user = await storage.getUserByUsername(username) || 
                       await storage.getUserByEmail(username);
          
          if (!user) {
            return done(null, false, { message: "Invalid username or password" });
          }
          
          if (!(await comparePasswords(password, user.password))) {
            return done(null, false, { message: "Invalid username or password" });
          }
          
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication routes
  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, email, password, fullName } = req.body;
      
      // Check if username or email already exists
      const existingUser = 
        await storage.getUserByUsername(username) || 
        await storage.getUserByEmail(email);
        
      if (existingUser) {
        return res.status(400).json({ 
          message: "Username or email already exists" 
        });
      }

      // Create the user with hashed password
      const user = await storage.createUser({
        username,
        email,
        password: await hashPassword(password),
        fullName: fullName || null,
        createdAt: new Date().toISOString(),
        accountType: "free",
        projectsLimit: 3,
        storage: 10,
        avatarUrl: null,
        isActive: true,
      });

      // Log the user in
      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send the password back to the client
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        // Don't send the password back to the client
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Don't send the password back to the client
    const { password, ...userWithoutPassword } = req.user as SelectUser;
    res.json(userWithoutPassword);
  });

  // This can be used to check if a user has hit their project limit
  app.get("/api/user/limits", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = req.user as SelectUser;
    
    try {
      // Get user's current project count
      const projects = await storage.getUserProjects(user.id);
      
      res.json({
        projectsCount: projects.length,
        projectsLimit: user.projectsLimit,
        storageUsed: 0, // This should be calculated based on actual usage
        storageLimit: user.storage,
        accountType: user.accountType,
        canCreateProject: projects.length < user.projectsLimit,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user limits" });
    }
  });

  // Guest mode - create a temporary user without registration
  app.post("/api/guest", async (req, res, next) => {
    try {
      // Create a guest user with a random username and password
      const guestId = randomBytes(8).toString("hex");
      const randomPassword = randomBytes(16).toString("hex");
      
      const user = await storage.createUser({
        username: `guest_${guestId}`,
        email: `guest_${guestId}@launchplate.temp`,
        password: await hashPassword(randomPassword),
        fullName: "Guest User",
        createdAt: new Date().toISOString(),
        accountType: "guest",
        projectsLimit: 1, // Guest users can only create one project
        storage: 5, // Limited storage for guest users
        avatarUrl: null,
        isActive: true,
      });

      // Log the user in
      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send the password back to the client
        const { password, ...userWithoutPassword } = user;
        res.status(201).json({
          ...userWithoutPassword,
          isGuest: true,
        });
      });
    } catch (error) {
      next(error);
    }
  });

  // Middleware to check if user is authenticated
  app.use("/api/projects", (req, res, next) => {
    if (req.method === "GET" && req.path === "/") {
      // Public projects endpoint is accessible to everyone
      return next();
    }
    
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    next();
  });
}