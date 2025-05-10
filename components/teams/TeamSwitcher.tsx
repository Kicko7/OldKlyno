"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getTeams } from "@/db/teams"
import { useUser } from "@/context/user-context"
import { createTeam } from "@/db/teams"

export const TeamSwitcher = () => {
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false)
  const [teamName, setTeamName] = useState("")
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    const fetchTeams = async () => {
      if (!user) return
      const fetchedTeams = await getTeams(user.id)
      setTeams(fetchedTeams)
      setLoading(false)
    }
    fetchTeams()
  }, [user])

  const handleCreateTeam = async () => {
    if (!user || !teamName) return
    const newTeam = await createTeam({ name: teamName })
    setTeams([...teams, newTeam])
    setShowCreateTeamModal(false)
    setTeamName("")
  }

  if (loading) {
    return <div>Loading teams...</div>
  }

  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <h2 className="mb-4 text-xl font-bold">No teams found</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateTeamModal(true)}
        >
          Create a Team
        </button>
        {showCreateTeamModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded bg-white p-6 shadow-lg">
              <h3 className="mb-2 text-lg font-bold">Create a Team</h3>
              <input
                className="mb-4 w-full border p-2"
                placeholder="Team name"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
              />
              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={handleCreateTeam}>
                  Create
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCreateTeamModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <select
        className="w-full rounded border p-2"
        onChange={e => router.push(`/teams/${e.target.value}`)}
      >
        <option value="">Select a team</option>
        {teams.map(team => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  )
}
