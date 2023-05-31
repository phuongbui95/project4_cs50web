function Hello(props) {
    return (
        <h1>Hello, {props.name}!</h1>
    );
}

// All functions are triggered here
function App() {
    return (
        <div>
            <Hello name="Thor"/>
            
        </div>
        
    );
}

ReactDOM.render(<App />, document.querySelector("#app"));