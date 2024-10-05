import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react'
import { Api } from '../services/api/Index'
import { useNavigate } from 'react-router-dom'

// Definição da forma dos dados no contexto
interface AuthContextData {
    isAuthenticated: boolean
    carregando: boolean
    handleLogin: (usuario: string, senha: string) => Promise<void>
    handleLogout: () => void
    setNivelUsuario: React.Dispatch<React.SetStateAction<string>>
    nivelUsuario: string
    nomeUsuario: string
    municipioUsuario: string
    chaveSecreta: string
}

// Criando o contexto com o tipo definido
const AuthContext = createContext<AuthContextData>({} as AuthContextData)

// Hook personalizado para utilizar o contexto
export const useAuthContext = () => {
    return useContext(AuthContext)
}

interface MyAuthProps {
    children: ReactNode
}

export const Auth: React.FC<MyAuthProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const [nivelUsuario, setNivelUsuario] = useState("")
    const [nomeUsuario, setNomeUsuario] = useState("")
    const [municipioUsuario, setMunicipioUsuario] = useState("")
    const [chaveSecreta, setChaveSecreta] = useState("")
    const navigate = useNavigate()

    const handleLogin = useCallback(async (usuario: string, senha: string) => {
        setCarregando(true)
        try {
            const response = await Api.post('/auth/logar', {
                usuario: usuario,
                senha: senha
            })
            if (response.status === 200 && response.data.length > 0) {
                setIsAuthenticated(true)
                setNivelUsuario(response.data[0].nivel)
                setNomeUsuario(response.data[0].nome)
                setMunicipioUsuario(response.data[0].municipio)
                setChaveSecreta(response.data[0].chave_secreta)
                navigate("/home")
            } else {
                setNivelUsuario("0")
                console.error('Usuário não encontrado ou erro na resposta do servidor')
            }
            setCarregando(false)
        } catch (error) {
            setNivelUsuario("")
            setChaveSecreta("")
            console.error(error)
            setCarregando(false)
        }
    }, [])


    const handleLogout = useCallback(() => {
        setIsAuthenticated(false)
        setNivelUsuario("")
        navigate("/")
    }, [navigate])

    return (
        <AuthContext.Provider value={{ isAuthenticated, handleLogin, handleLogout, nivelUsuario, setNivelUsuario, nomeUsuario, municipioUsuario, chaveSecreta, carregando }}>
            {children}
        </AuthContext.Provider>
    )
}
