
export const careerFields = [
  {
    id: 'fullstack',
    name: 'Fullstack Developer',
    description: 'Master both frontend and backend development',
    icon: '💻',
    skills: ['web-development', 'javascript', 'database', 'ui-ux', 'devops']
  },
  {
    id: 'android',
    name: 'Android Developer',
    description: 'Build powerful mobile applications',
    icon: '📱',
    skills: ['mobile-development', 'java', 'kotlin', 'ui-ux', 'firebase']
  },
  {
    id: 'datascience',
    name: 'Data Scientist',
    description: 'Analyze data and build ML models',
    icon: '📊',
    skills: ['python', 'data-science', 'machine-learning', 'database', 'cloud-computing']
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity Specialist',
    description: 'Protect systems and networks',
    icon: '🔒',
    skills: ['cybersecurity', 'networking', 'linux', 'python', 'cloud-computing']
  }
]

export function getFieldById(id) {
  return careerFields.find(field => field.id === id)
}
