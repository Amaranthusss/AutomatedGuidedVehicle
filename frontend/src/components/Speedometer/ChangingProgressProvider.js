import React from "react"
import Cookies from 'js-cookie'

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
            this.setState({ currentValue: Cookies.get('_velocity') })
        }, this.intervalTime)
    }

    render() {
        return this.props.children(this.state.currentValue)
    }
}

export default ChangingProgressProvider
