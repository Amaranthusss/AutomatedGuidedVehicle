import React from "react"

class ChangingProgressProvider extends React.Component {
    constructor(props) {
        super(props)
        this.intervalTime = 1000
    }

    state = {
        currentValue: 0
    };

    componentDidMount() {
        setInterval(() => {
            this.setState({ currentValue: (Math.floor(Math.random() * 12) + 1 + Math.random()).toFixed(2) })
        }, this.intervalTime)
    }

    render() {
        return this.props.children(this.state.currentValue)
    }
}

export default ChangingProgressProvider
