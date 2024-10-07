'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const Dashboard = () => {
  const router = useRouter()
  const publicKey = localStorage.getItem('publickey')
  console.log('publicKey', publicKey)
  if(!publicKey) {
    router.push('/')
  }
  return (
    <div>dashboard</div>
  )
}

export default Dashboard