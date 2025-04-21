import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, InsertUser, SubscriptionTiers, SubscriptionTier } from "@shared/schema";

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

// Configure user permissions based on subscription tier
function configureTierPermissions(tier: SubscriptionTier): {
  projectsLimit: number;
  pagesLimit: number;
  storage: number;
  canDeploy: boolean;
  canSaveTemplates: boolean;
} {
  switch (tier) {
    case SubscriptionTiers.GUEST:
      return {
        projectsLimit: 1,
        pagesLimit: 1,
        storage: 5,
        canDeploy: false,
        canSaveTemplates: false
      };
    case SubscriptionTiers.FREE:
      return {
        projectsLimit: 3,
        pagesLimit: 1,
        storage: 10,
        canDeploy: false,
        canSaveTemplates: false
      };
    case SubscriptionTiers.PAID:
      return {
        projectsLimit: 10,
        pagesLimit: 1,
        storage: 50,
        canDeploy: true,
        canSaveTemplates: true
      };
    case SubscriptionTiers.PREMIUM:
      return {
        projectsLimit: 30,
        pagesLimit: 3,
        storage: 100,
        canDeploy: true,
        canSaveTemplates: true
      };
    default:
      return configureTierPermissions(SubscriptionTiers.FREE);
  }
}

// Get human-readable name for subscription tier
function getTierDisplayName(tier: SubscriptionTier): string {
  switch (tier) {
    case SubscriptionTiers.GUEST:
      return "Guest";
    case SubscriptionTiers.FREE:
      return "Free";
    case SubscriptionTiers.PAID:
      return "Pro";
    case SubscriptionTiers.PREMIUM:
      return "Premium";
    default:
      return "Unknown";
  }
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

      // Get the default tier permissions
      const tierType = SubscriptionTiers.FREE;
      const tierPermissions = configureTierPermissions(tierType);

      // Create the user with hashed password
      const user = await storage.createUser({
        username,
        email,
        password: await hashPassword(password),
        fullName: fullName || null,
        createdAt: new Date().toISOString(),
        accountType: tierType,
        projectsLimit: tierPermissions.projectsLimit,
        pagesLimit: tierPermissions.pagesLimit,
        storage: tierPermissions.storage,
        canDeploy: tierPermissions.canDeploy,
        canSaveTemplates: tierPermissions.canSaveTemplates,
        avatarUrl: null,
        isActive: true,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
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
      
      // Get the user's subscription tier info
      const tierPermissions = configureTierPermissions(user.accountType as SubscriptionTier);
      
      res.json({
        // Project limits
        projectsCount: projects.length,
        projectsLimit: user.projectsLimit || tierPermissions.projectsLimit,
        canCreateProject: projects.length < (user.projectsLimit || tierPermissions.projectsLimit),
        
        // Page limits (for premium users)
        pagesLimit: user.pagesLimit || tierPermissions.pagesLimit,
        
        // Storage limits
        storageUsed: 0, // This should be calculated based on actual usage
        storageLimit: user.storage || tierPermissions.storage,
        
        // Subscription info
        accountType: user.accountType,
        tierName: getTierDisplayName(user.accountType as SubscriptionTier),
        isGuest: user.accountType === SubscriptionTiers.GUEST,
        isPaid: user.accountType === SubscriptionTiers.PAID || user.accountType === SubscriptionTiers.PREMIUM,
        isPremium: user.accountType === SubscriptionTiers.PREMIUM,
        
        // Feature permissions
        canDeploy: user.canDeploy !== null ? user.canDeploy : tierPermissions.canDeploy,
        canSaveTemplates: user.canSaveTemplates !== null ? user.canSaveTemplates : tierPermissions.canSaveTemplates,
        
        // Stripe info (if applicable)
        hasSubscription: !!user.stripeSubscriptionId,
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
      
      // Get guest tier permissions
      const tierType = SubscriptionTiers.GUEST;
      const tierPermissions = configureTierPermissions(tierType);
      
      const user = await storage.createUser({
        username: `guest_${guestId}`,
        email: `guest_${guestId}@launchplate.temp`,
        password: await hashPassword(randomPassword),
        fullName: "Guest User",
        createdAt: new Date().toISOString(),
        accountType: tierType,
        projectsLimit: tierPermissions.projectsLimit,
        pagesLimit: tierPermissions.pagesLimit,
        storage: tierPermissions.storage,
        canDeploy: tierPermissions.canDeploy,
        canSaveTemplates: tierPermissions.canSaveTemplates,
        avatarUrl: null,
        isActive: true,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
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