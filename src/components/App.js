import React, { Component } from "react";
import "./App.css";

const domain = _path => `http://localhost:4001${_path}`;

const getData = () => {
    return fetch(domain("/")).then(response => response.json());
};

const saveData = data => {
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            accept: "application/json"
        },
        body: JSON.stringify({ data: data })
    };

    return fetch(domain("/save"), options).then(response => response.json());
};

class App extends Component {
    state = {
        data: {}
    };

    componentDidMount() {
        getData().then(data => {
            this.setState({ data: JSON.stringify(data, null, 4) });
        });
    }

    onChange = ev => {
        this.setState({ data: ev.target.value });
    };

    save = () => {
        const { data } = this.state;

        saveData(data).then(response => {
            if (response && response.success) {
                // alert("success");
            }
        });
    };

    render() {
        const { data } = this.state;

        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to i18n</h1>
                </header>
                <div className="App">
                    <textarea value={data} onChange={this.onChange} />
                </div>
                <button onClick={this.save}>Save</button>
            </div>
        );
    }
}

export default App;
