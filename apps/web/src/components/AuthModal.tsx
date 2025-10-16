import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  username: z.string().min(3, 'Username deve ter pelo menos 3 caracteres'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (userData: any) => void
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onLoginSubmit = async (data: LoginForm) => {
    try {
      const response = await api.post('/api/auth/login', data)
      const { accessToken, refreshToken, user } = response.data
      
      // Salvar tokens no store
      useAuthStore.getState().setTokens(accessToken, refreshToken)
      
      onLogin(user)
      toast.success('Login realizado com sucesso!')
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login')
    }
  }

  const onRegisterSubmit = async (data: RegisterForm) => {
    try {
      const response = await api.post('/api/auth/register', data)
      const { accessToken, refreshToken, user } = response.data
      
      // Salvar tokens no store
      useAuthStore.getState().setTokens(accessToken, refreshToken)
      
      onLogin(user)
      toast.success('Conta criada com sucesso!')
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao criar conta')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Registrar'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Entre com sua conta' : 'Crie uma nova conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogin ? (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <Input
                  {...loginForm.register('email')}
                  type="email"
                  placeholder="Email"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  {...loginForm.register('password')}
                  type="password"
                  placeholder="Senha"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Entrar
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div>
                <Input
                  {...registerForm.register('email')}
                  type="email"
                  placeholder="Email"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  {...registerForm.register('username')}
                  placeholder="Username"
                />
                {registerForm.formState.errors.username && (
                  <p className="text-sm text-red-500 mt-1">
                    {registerForm.formState.errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  {...registerForm.register('password')}
                  type="password"
                  placeholder="Senha"
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Registrar
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Não tem conta? Registre-se' : 'Já tem conta? Faça login'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
