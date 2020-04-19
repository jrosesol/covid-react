import React from 'react'
import ReactDOM from 'react-dom';
import {Line} from 'react-chartjs-2';
import JP from 'jsonpath';
import Default from '../layouts/default'
import axios from 'axios'
const meta = { title: 'Index title', description: 'Index description' }

var query = `query countriesLevels($places: [Place!]) {
    countriesLevels(places: $places) {
      country
      province_state
      measures {
        date
        confirmed
      }
    }
  }`;

class IndexPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      graphData: {}
    }
  }
  async componentDidMount () {
    await this.fetchData()
  }
  async fetchData () {
    this.setState({ loading: true })
    fetch('https://cors-anywhere.herokuapp.com/https://mok0clsan7.execute-api.us-east-1.amazonaws.com/dev/graphql', {
    //fetch('http://localhost:4000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        query,
        variables: {"places":[{"country":"Canada", "province_state":"Quebec"},
                              {"country":"Canada", "province_state":"Ontario"},
                              {"country":"Canada", "province_state":"Alberta"},
                              {"country":"Canada", "province_state":"Manitoba"},
                              {"country":"Canada", "province_state":"British Columbia"},
                              {"country":"Canada", "province_state":"New Brunswick"},
                              {"country":"Canada", "province_state":"Saskatchewan"},
                              {"country":"Canada", "province_state":"Newfoundland and Labrador"},
                              {"country":"Canada", "province_state":"Prince Edward Island"},
                              {"country":"Canada", "province_state":"Nova Scotia"},
                              {"country":"Canada", "province_state":"Northwest Territories"},
                              {"country":"Canada", "province_state":"Yukon"}]},
      })
    }).then(r => r.json())
      .then(data => {
        let graph = {
          labels: [],
          datasets: []
        };

        let datasets = JP.query(data, '$.data.countriesLevels.*')
        for (let step = 0; step < datasets.length; step++) {
          let r = Math.floor(Math.random() * 255)
          let g = Math.floor(Math.random() * 255)
          let b = Math.floor(Math.random() * 255)
          graph.datasets.push(
            {
              label: datasets[step].province_state,
              fill: false,
              lineTension: 0.1,
              backgroundColor: `rgba(${r},${g},${b},0.4)`,
              borderColor: `rgba(${r},${g},${b},1)`,
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: `rgba(${r},${g},${b},1)`,
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: `rgba(${r},${g},${b},1)`,
              pointHoverBorderColor: `rgba(${r},${g},${b},1)`,
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: JP.query(datasets[step].measures, '$.*.confirmed').slice(50)
            }
          )
        }

        graph.labels = JP.query(data, '$.data.countriesLevels[0].measures.*.date').slice(50)
        graph.labels = graph.labels.map(x => (new Date(x)).getMonth()+1+"-"+(new Date(x)).getDate()+"-"+(new Date(x)).getFullYear());
        this.setState({
          graphData: graph
        })
      } )
      .then( console.log(this.state.graphData) )
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });

      this.setState({ loading: false })
  }
  render () {
    return (
      <Default meta={meta}>
      <Line height={480} width={720} responsive={true} maintainAspectRatio={false} data={() => this.state.graphData} />

      </Default>
    )
  }
}

export default IndexPage
