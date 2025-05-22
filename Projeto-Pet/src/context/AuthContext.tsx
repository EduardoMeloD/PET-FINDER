import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {auth, db} from '../pages/firebase'
import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged,
updateProfile,
User as FirebaseUser
} from 'firebase/auth'
import {doc, setDoc, getDoc} from 'firebase/firestore'
import { FirebaseError } from 'firebase/app';


// This would typically connect to Supabase in a real application
interface User {
  id: string;
  name: string;
  email: string;
}
// criei essa interface para mandar os dados do usuario pro firebase
interface UserData {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin'; // Campo opcional para compatibilidade backward
  type?: 'user' | 'admin'; // Campo type como visto no Firebase
  phone: string;
  createdAt: Date;
}

// Define a interface para o contexto usando o tipo FirebaseUser
interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "usuarios", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log("usuario encontrado", data);
        console.log("type do usuario", data.type); // Verificando o campo type
        
        const formattedUserData = {
          id: uid,
          name: data.name,
          email: data.email,
          role: data.role || data.type || 'user', // Prioriza role, depois type, ou assume 'user'
          type: data.type || data.role || 'user', // Mantém compatibilidade nos dois formatos
          phone: data.phone,
          createdAt: data.createdAt?.toDate() || new Date()
        };
        
        setUserData(formattedUserData);
        console.log("userData atualizado", formattedUserData);
      } else {
        console.log("Documento do usuário não encontrado");
        // Se não existe dados do usuário, definir como usuário padrão
        setUserData({
          id: uid,
          name: user?.displayName || '',
          email: user?.email || '',
          role: 'user',
          type: 'user',
          phone: '',
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser);
      setUser(firebaseUser);

      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setUserData(null);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Auth state error:', error);
      setIsLoading(false);
    });
  
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Esperar explicitamente pelo fetchUserData para garantir que os dados foram carregados
      await fetchUserData(userCredential.user.uid);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, {displayName: name});
      
      // Criar documento do usuário no Firestore
      await setDoc(doc(db, "usuarios", cred.user.uid), {
        name,
        email,
        phone,
        type: 'user', // Usando type em vez de role para manter consistência
        createdAt: new Date()
      });
      
      // Buscar dados do usuário recém-criado
      await fetchUserData(cred.user.uid);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error('Logout error', error);
      throw error;
    }
  };

  // Calcular isAdmin baseado no userData atual
  const isAdmin = userData?.role === 'admin' || userData?.type === 'admin';

  useEffect(() => {
    console.log("Estado atual do contexto", {
      userData,
      isAdmin,
      role: userData?.role,
      type: userData?.type
    });
  }, [userData, isAdmin]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin, // Usando o valor calculado
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}