import React, { useContext, createContext, PropsWithChildren, useState } from 'react';
import { LoginRequest } from 'app/controllers/login.controller';
import Member from 'app/entities/Member';
import { authInfo } from 'pages/_app';
import useAlert from './useAlert';
import { useTRPC } from './useTRPC';

interface AuthContextProps {
  member: Member | null;
  login(req: LoginRequest): void;
  isMutating: boolean;
  isFetching: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [member, setMember] = useState<Member | null>(null);
  const { useMutation, useQuery } = useTRPC();
  const alert = useAlert();

  const loginMutation = useMutation('login', {
    onSuccess(data, req) {
      setMember({
        name: req.name,
      });
      authInfo.token = data.token;
      localStorage.setItem('auth', data.token);
      alert.success('Logado!');
    },
    onError(error) {
      alert.error('Erro no login', error.message);
    },
  });

  const { isLoading } = useQuery(['me'], {
    onSuccess(data) {
      if (!data) {
        setMember(null);
        localStorage.removeItem('auth');
        return;
      }

      setMember(data.member);
    },
  });

  const login = (req: LoginRequest): void => {
    loginMutation.mutate(req);
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        member,
        isFetching: isLoading,
        isMutating: loginMutation.isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextProps => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('Auth context must be used within a provider');
  }

  return auth;
};

export default useAuth;
