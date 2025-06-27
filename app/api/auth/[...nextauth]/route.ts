// app/api/auth/[...nextauth]/route.ts

// 1. IMPORTACIONES NECESARIAS
import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma"; // Importamos nuestra instancia única de Prisma
import { compare } from "bcrypt"; // Importamos 'compare' para comparar contraseñas
import GoogleProvider from "next-auth/providers/google";

// 2. CONFIGURACIÓN PRINCIPAL DE NEXTAUTH
export const authOptions: AuthOptions = {
  // Esta es la línea mágica que conecta NextAuth con tu base de datos a través de Prisma.
  // Guardará usuarios, sesiones, etc., automáticamente en tus colecciones de MongoDB.
  adapter: PrismaAdapter(prisma),

  // Aquí definimos los "métodos" de inicio de sesión. Usaremos "Credentials" (email/contraseña).
  providers: [
     GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Esta función es el núcleo de la lógica de login. Se ejecuta cuando alguien intenta iniciar sesión.
      async authorize(credentials) {
        // Si no se envió email o contraseña, no autorizamos.
        if (!credentials?.email || !credentials.password) {
          throw new Error("Por favor, introduce tu email y contraseña");
        }

        // Buscamos al usuario en la base de datos por su email.
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Si no se encontró al usuario o si el usuario no tiene una contraseña guardada.
        if (!user || !user.password) {
          throw new Error("No se encontró un usuario con ese email");
        }

        // Comparamos la contraseña enviada desde el formulario con la contraseña encriptada en la base de datos.
        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        // Si las contraseñas no coinciden.
        if (!isPasswordValid) {
          throw new Error("La contraseña es incorrecta");
        }

        // Si todo está correcto, devolvemos el objeto 'user' para que NextAuth cree la sesión.
        return user;
      },
    }),
  ],

  // Usaremos JSON Web Tokens (JWT) para gestionar las sesiones.
  session: {
    strategy: "jwt",
  },
  callbacks: {
    signIn({ user, account }) {
      // Si el inicio de sesión es con Google
      if (account?.provider === "google") {
        // Lista de emails de administradores autorizados
        const allowedEmails = ["admin@pizzeria.com", "misa132456@gmail.com", "joeloliva@iresm.edu.ar"];
        
        // Si el email del usuario que intenta loguearse está en la lista, permite el acceso.
        if (user.email && allowedEmails.includes(user.email)) {
          return true;
        } else {
          // Si no está en la lista, deniega el acceso.
          return false; // Puedes redirigir a una página de error desde aquí.
        }
      }
      // Para otros proveedores (como credentials), permite siempre el acceso.
      return true;
    },
    // Este callback se ejecuta cuando se crea o actualiza un JSON Web Token.
    jwt({ token, user }) {
      // Al iniciar sesión (cuando 'user' está disponible), añadimos el rol al token.
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    // Este callback se ejecuta cuando se accede a una sesión.
    session({ session, token }) {
      // Pasamos el rol desde el token a la sesión que ve el cliente.
      if (token?.role && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  // =======================================================

  // El secreto que pusiste en tu archivo .env
  secret: process.env.NEXTAUTH_SECRET,
};

// 4. EXPORTAR EL HANDLER
// Creamos el handler de NextAuth con nuestra configuración
const handler = NextAuth(authOptions);

// Exportamos el handler para que funcione con las peticiones GET y POST.
export { handler as GET, handler as POST };