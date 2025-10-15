import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import toast from 'react-hot-toast'

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Connect to WebSocket
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
      transports: ['websocket'],
    })

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket')
    })

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket')
    })

    socketRef.current.on('notification', (notification) => {
      toast.success(notification.message, {
        duration: 5000,
      })
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  return socketRef.current
}
