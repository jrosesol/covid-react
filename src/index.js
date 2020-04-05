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
var query = `query countryLevels($country: String!, $province_state: String!) {
    countryLevels(country: $country, province_state: $province_state) {
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
    fetch('https://cors-anywhere.herokuapp.com/https://mok0clsan7.execute-api.us-east-1.amazonaws.com/dev/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        query,
        variables: { country, province_state },
      })
    }).then(r => r.json())
      .then(data => {
        let graph = {
          labels: [1,2,3],
          datasets: [
            {
              label: 'Quebec',
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

        graph.datasets[0].data = JP.query(data, '$.data.countryLevels.*.measures.*.confirmed');
        graph.labels = JP.query(data, '$.data.countryLevels.*.measures.*.date');
        graph.labels = graph.labels.map(x => (new Date(x)).getMonth()+1+"-"+(new Date(x)).getDate()+1+"-"+(new Date(x)).getFullYear());
        this.setState({
          graphData: graph
        })
      } )
      .then( console.log(this.state.graphData) )
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });

    fetch('https://cors-anywhere.herokuapp.com/https://mok0clsan7.execute-api.us-east-1.amazonaws.com/dev/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        query,
        variables: { country, province_state: 'ontario' },
      })
    }).then(r => r.json())
      .then(data => {
        let graph = {
          labels: [1,2,3],
          datasets: [
            {
              label: 'Ontario',
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(192,152,75,0.4)',
              borderColor: 'rgba(192,152,75,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(192,152,75,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(192,152,75,1)',
              pointHoverBorderColor: 'rgba(192,152,75,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [1,2,3]
            }
          ]
        };

        graph.datasets[0].data = JP.query(data, '$.data.countryLevels.*.measures.*.confirmed');
        graph.labels = JP.query(data, '$.data.countryLevels.*.measures.*.date');
        graph.labels = graph.labels.map(x => (new Date(x)).getMonth()+1+"-"+(new Date(x)).getDate()+1+"-"+(new Date(x)).getFullYear());
        let newData = this.state.graphData
        newData.datasets.push(graph.datasets[0])
        this.setState({
          graphData: newData
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
          <h2>Covid quebec</h2>
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
