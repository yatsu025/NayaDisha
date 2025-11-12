// Available skills for selection

export const availableSkills = [
  { id: 'python', name: 'Python Programming', icon: '🐍', category: 'programming' },
  { id: 'javascript', name: 'JavaScript', icon: '⚡', category: 'programming' },
  { id: 'data-science', name: 'Data Science', icon: '📊', category: 'data' },
  { id: 'machine-learning', name: 'Machine Learning', icon: '🤖', category: 'ai' },
  { id: 'web-development', name: 'Web Development', icon: '🌐', category: 'web' },
  { id: 'mobile-development', name: 'Mobile Development', icon: '📱', category: 'mobile' },
  { id: 'database', name: 'Database Management', icon: '🗄️', category: 'backend' },
  { id: 'devops', name: 'DevOps', icon: '⚙️', category: 'infrastructure' },
  { id: 'ui-ux', name: 'UI/UX Design', icon: '🎨', category: 'design' },
  { id: 'cloud-computing', name: 'Cloud Computing', icon: '☁️', category: 'infrastructure' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: '🔒', category: 'security' },
  { id: 'blockchain', name: 'Blockchain', icon: '⛓️', category: 'emerging' }
]

export function getSkillById(id) {
  return availableSkills.find(skill => skill.id === id)
}

export function getSkillsByIds(ids) {
  return ids.map(id => getSkillById(id)).filter(Boolean)
}
