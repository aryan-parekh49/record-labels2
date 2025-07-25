import CrimeList from './CrimeList'
import CrimeForm from './CrimeForm'

function DashboardPI() {
  return (
    <div>
      <h2>Crime CRS - PI Dashboard</h2>
      <CrimeForm />
      <CrimeList />
    </div>
  )
}

export default DashboardPI
