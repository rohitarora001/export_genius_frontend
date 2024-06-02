import { createContext, useState, useEffect, FC, useContext } from 'react';
import { AuthContextProps, AuthProviderProps } from '@/models/auth';
import { validateToken } from '@/services/api';

// Create the context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Define the component
const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    // State to manage user login status
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);

    // Function to validate JWT
    const validateJWT = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await validateToken();
                if (response.status === 200 && response.data.valid) {
                    setUserLoggedIn(true);
                }
            }
        } catch (error) {
            setUserLoggedIn(false);
        }
    };

    // Effect to run validation when component mounts
    useEffect(() => {
        validateJWT();
    }, []);

    // Return the provider component with its children wrapped in the context provider
    return (
        <AuthContext.Provider value={{ userLoggedIn, setUserLoggedIn, validateJWT }}>
            {children}
        </AuthContext.Provider>
    );
};

// Export the context and provider
export { AuthContext, AuthProvider };
export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
