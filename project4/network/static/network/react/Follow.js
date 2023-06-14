function Hello() {
    return (
        alert("hello world")
    )
}

function App() {
    return <Hello />;
}

ReactDOM.render(<App />, document.querySelector('#profile_admin'))