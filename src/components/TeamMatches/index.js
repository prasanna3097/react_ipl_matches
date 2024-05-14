// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'
import './index.css'

class TeamMatches extends Component {
  state = {
    isLoading: true,
    teamData: {},
  }

  componentDidMount() {
    this.getTeamMatches()
  }

  updateData = data => ({
    umpires: data.umpires,
    result: data.result,
    manOfTheMatch: data.man_of_the_match,
    id: data.id,
    date: data.date,
    venue: data.venue,
    competingTeam: data.competing_team,
    competingTeamLogo: data.competing_team_logo,
    firstInnings: data.first_innings,
    secondInnings: data.second_innings,
    matchStatus: data.match_status,
  })

  getTeamMatches = async () => {
    const {
      match: {
        params: {id},
      },
    } = this.props

    const apiUrl = `https://apis.ccbp.in/ipl/${id}`
    const response = await fetch(apiUrl)
    const data = await response.json()
    const updatedData = {
      teamBannerURL: data.team_banner_url,
      latestMatch: this.updateData(data.latest_match_details),
      recentMatches: data.recent_matches.map(match => this.updateData(match)),
    }

    this.setState({
      teamData: updatedData,
      isLoading: false,
    })
  }

  renderRecentMatchesList = () => {
    const {teamData} = this.state
    const {recentMatches} = teamData

    return (
      <ul className="recent-matches-list">
        {recentMatches.map(match => (
          <MatchCard details={match} key={match.id} />
        ))}
      </ul>
    )
  }

  renderTeamMatches = () => {
    const {teamData} = this.state
    const {teamBannerURL, latestMatch} = teamData

    return (
      <div className="responsive-container">
        <img src={teamBannerURL} alt="team banner" className="team-banner" />
        <LatestMatch details={latestMatch} />
        {this.renderRecentMatchesList()}
      </div>
    )
  }

  renderLoader = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height={50} />
    </div>
  )

  getRouteClassName = () => {
    const {
      match: {
        params: {id},
      },
    } = this.props

    switch (id) {
      case 'RCB':
        return 'rcb'
      case 'KKR':
        return 'kkr'
      case 'KXP':
        return 'kxp'
      case 'CSK':
        return 'csk'
      case 'RR':
        return 'rr'
      case 'MI':
        return 'mi'
      case 'SH':
        return 'srh'
      case 'DC':
        return 'dc'
      default:
        return ''
    }
  }

  render() {
    const {isLoading} = this.state
    const className = `team-matches-container ${this.getRouteClassName()}`

    return (
      <div className={className}>
        {isLoading ? this.renderLoader() : this.renderTeamMatches()}
      </div>
    )
  }
}

export default TeamMatches
