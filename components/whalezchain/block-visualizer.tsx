"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Box, ArrowRight, Clock, Hash } from "lucide-react"

interface Block {
  id: number
  hash: string
  previousHash: string
  transactions: number
  timestamp: string
  tokens: { PTN: number; PRN: number; WHZ: number }
}

const generateHash = () => {
  const chars = "0123456789abcdef"
  let hash = "0x"
  for (let i = 0; i < 16; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}

const initialBlocks: Block[] = [
  {
    id: 1001,
    hash: "0x7a3f2e1d8c9b4a5f",
    previousHash: "0x0000000000000000",
    transactions: 12,
    timestamp: "12:34:56",
    tokens: { PTN: 5000, PRN: 2500, WHZ: 150 },
  },
  {
    id: 1002,
    hash: "0x9c8d7b6a5e4f3c2d",
    previousHash: "0x7a3f2e1d8c9b4a5f",
    transactions: 8,
    timestamp: "12:35:12",
    tokens: { PTN: 3200, PRN: 1800, WHZ: 95 },
  },
  {
    id: 1003,
    hash: "0x2b4c6d8e0f1a3c5e",
    previousHash: "0x9c8d7b6a5e4f3c2d",
    transactions: 15,
    timestamp: "12:35:48",
    tokens: { PTN: 7800, PRN: 4200, WHZ: 210 },
  },
  {
    id: 1004,
    hash: "0x5f7e9d1c3b2a4c6e",
    previousHash: "0x2b4c6d8e0f1a3c5e",
    transactions: 6,
    timestamp: "12:36:24",
    tokens: { PTN: 1500, PRN: 900, WHZ: 45 },
  },
  {
    id: 1005,
    hash: "0x8a1b3c5d7e9f0a2c",
    previousHash: "0x5f7e9d1c3b2a4c6e",
    transactions: 11,
    timestamp: "12:37:00",
    tokens: { PTN: 4600, PRN: 2100, WHZ: 125 },
  },
]

export function BlockVisualizer() {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [newBlockAnimation, setNewBlockAnimation] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setNewBlockAnimation(true)
      const lastBlock = blocks[blocks.length - 1]
      const newBlock: Block = {
        id: lastBlock.id + 1,
        hash: generateHash(),
        previousHash: lastBlock.hash,
        transactions: Math.floor(Math.random() * 15) + 3,
        timestamp: new Date().toLocaleTimeString(),
        tokens: {
          PTN: Math.floor(Math.random() * 8000) + 1000,
          PRN: Math.floor(Math.random() * 4000) + 500,
          WHZ: Math.floor(Math.random() * 200) + 30,
        },
      }
      setBlocks((prev) => [...prev.slice(-4), newBlock])
      setTimeout(() => setNewBlockAnimation(false), 500)
    }, 8000)

    return () => clearInterval(interval)
  }, [blocks])

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Box className="w-5 h-5 text-primary" />
          Live Block Chain
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 overflow-x-auto pb-4">
          {blocks.map((block, index) => (
            <div key={block.id} className="flex items-center">
              <div
                className={`min-w-[200px] p-4 rounded-lg border transition-all duration-500 ${
                  index === blocks.length - 1 && newBlockAnimation
                    ? "bg-primary/20 border-primary scale-105"
                    : "bg-secondary/50 border-border/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-primary">Block #{block.id}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {block.timestamp}
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground font-mono">
                  <Hash className="w-3 h-3" />
                  {block.hash}
                </div>
                <div className="flex gap-1 flex-wrap mb-2">
                  <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                    PTN: {block.tokens.PTN.toLocaleString()}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    PRN: {block.tokens.PRN.toLocaleString()}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/30">
                    WHZ: {block.tokens.WHZ.toLocaleString()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{block.transactions} transactions</p>
              </div>
              {index < blocks.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground mx-1 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
