import React from 'react';
import ReactDOM from 'react-dom';
import {Line} from 'react-chartjs-2';
import JP from 'jsonpath';

import './index.css';

var defaultGraph = {
  labels: [1,2,3],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [1,2,3]
    }
  ]
};

var country = 'canada';
var province_state = 'quebec';
var ontario = 'ontario'
//var query = `query countryLevels($country: String!, $province_state: String!) {
//    countryLevels(country: $country, province_state: $province_state) {
//      country
//      province_state
//      measures {
//        date
//        confirmed
//      }
//    }
//  }`;

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


class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graphData: {}
    }
  }

  componentDidMount() {
    //fetch('https://cors-anywhere.herokuapp.com/https://mok0clsan7.execute-api.us-east-1.amazonaws.com/dev/graphql', {
    fetch('http://localhost:4000', {
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
  }

  render() {
    return (
      <div>
        <div >
          <h2>Covid Canada</h2>
          <Line height={480} width={720} responsive={true} maintainAspectRatio={false} data={() => this.state.graphData} />
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
