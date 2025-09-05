// /src/features/setup/playerSetup.tsx
import { useState } from 'react'
import { useRootStore } from '@/store/createStore'
import { Player } from '@/types/domain'
import Button from '@/components/common/button'
import Card from '@/components/common/card'
import NumberInput from '@/components/common/numberInput'
import { generateId } from '@/lib/id'

type Props = {
  showHandicap?: boolean
}

export default function PlayerSetup({ showHandicap = false }: Props) {
  const players = useRootStore(s => s.players)
  const addPlayer = useRootStore(s => s.addPlayer)
  const updatePlayer = useRootStore(s => s.updatePlayer)
  const removePlayer = useRootStore(s => s.removePlayer)
  const resetPlayers = useRootStore(s => s.resetPlayers)

  const [name, setName] = useState('')
  const [color, setColor] = useState('#3b82f6')

  const onAdd = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const p: Player = { playerId: generateId('p_'), name: trimmed, color }
    addPlayer(p)
    setName('')
  }

  return (
    <Card title="Players" subtitle="Add 2–4 players. Matching ball colors will help during gameplay.">
      <div className="space-y-3">
        <div className="flex flex-row gap-2 sm:flex-row w-full">
          <input
            className="color-circle"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            title="Player color"
            
            style={{ width: 48, height: 48 }}
          />
          <input
            className="rounded-md border px-3 py-2 w-flex"
            placeholder="Player name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button 
          tone="primary"
          className='ml-auto' 
          onClick={onAdd}>
            Add
            </Button>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {players.map(p => (
            <div key={p.playerId} className="flex items-end justify-between rounded-md border p-2">
              <div className="flex items-center gap-2 w-full flex-nowrap">
                <input
                  className="color-circle"
                  type="color"
                  value={p.color}
                  onChange={(e) => updatePlayer({ ...p, color: e.target.value })}
                  title="Color"
                  style={{ width: 28, height: 28, flexShrink: 0 }}
                />
                <input
                  className="rounded-md border px-2 py-2 flex-1"
                  style={{ width: 'auto', minWidth: 0 }}
                  value={p.name}
                  onChange={(e) => updatePlayer({ ...p, name: e.target.value })}
                />

              
                {showHandicap && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs opacity-70">HCP</span>
                    <NumberInput
                      aria-label="Handicap"
                      value={p.handicap ?? 0}
                      onChange={(n) => updatePlayer({ ...p, handicap: n })}
                      min={-10}
                      max={10}
                      step={1}
                      style={{ width: 64 }}
                    />
                  </div>
                )}
                <Button
                variant='outline'
                weight="xlg"
                tone= "danger"
                className= "ml-auto"
                onClick={() => removePlayer(p.playerId)}
                >
                  X
                  </Button>
              </div>
            </div>
          ))}
        </div>

        {players.length > 0 && (
          <div className="pt-2"
                style={{ display: 'flex' , justifyContent: 'flex-end' }}>
            <Button 
            variant="outline" 
            onClick={resetPlayers}
            >
              Clear Players
              </Button>
          </div>
        )}
      </div>
    </Card>
  )
}